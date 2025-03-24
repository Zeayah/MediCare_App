import { validateChat, validateChatUpdate } from '../services/ai-chat-services/validation.js';
import { generateAIResponse } from '../services/ai-chat-services/openai-service.js';
import AIChat from '../models/AIChatmodel.js';
import User from '../models/Usermodel.js';
import createHttpError from 'http-errors';

// Medical disclaimer messages
const MEDICAL_DISCLAIMERS = {
    general: "This AI provides general medical information for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.",
    emergency: "If you are experiencing a medical emergency, please call your local emergency services or visit the nearest emergency room immediately.",
    consultation: "Always consult with qualified healthcare professionals for personalized medical advice.",
};

/**
 * Add medical disclaimers to AI response
 * @param {string} response - AI response
 * @param {boolean} isEmergency - Whether the context is marked as emergency
 * @returns {string} Response with appropriate disclaimers
 */
const addMedicalDisclaimers = (response, isEmergency) => {
    let disclaimers = [MEDICAL_DISCLAIMERS.general, MEDICAL_DISCLAIMERS.consultation];
    if (isEmergency) {
        disclaimers.unshift(MEDICAL_DISCLAIMERS.emergency);
    }
    return `${response}\n\n${disclaimers.join('\n')}`;
};

/**
 * Generate AI response based on medical context
 * @param {object} context - Medical context
 * @param {string} message - User message
 * @param {string} topic - Medical topic
 * @returns {Promise<string>} AI response
 */
const generateMedicalResponse = async (context, message, topic) => {
    // TODO: Integrate with actual AI service (e.g., OpenAI)
    // For now, return a placeholder response
    const response = `Thank you for your question about ${topic}. [AI response will be integrated here]`;
    return addMedicalDisclaimers(response, context?.isMedicalEmergency);
};

/**
 * Start a new AI chat session
 */
export const startChat = async (req, res, next) => {
    try {
        const { message, topic, context } = req.body;
        const userId = req.user._id;  // From auth middleware

        if (!message) {
            throw createHttpError(400, 'Message is required');
        }

        if (!userId) {
            throw createHttpError(401, 'Authentication required');
        }

        console.log('Starting new chat:', { 
            userId, 
            topic: topic || 'general_medicine',
            hasContext: !!context 
        });

        try {
            // Generate AI response
            const aiResponse = await generateAIResponse(message, topic, context);

            // Create new chat session
            const chat = await AIChat.create({
                userId,
                topic: topic || 'general_medicine',
                status: 'active',
                messages: [
                    { role: 'user', content: message },
                    { role: 'assistant', content: aiResponse }
                ],
                lastInteraction: new Date()
            });

            console.log('Chat created successfully:', chat._id);

            res.status(201).json({
                success: true,
                data: chat
            });
        } catch (aiError) {
            console.error('AI/Database error:', aiError);
            if (aiError.message.includes('OpenAI')) {
                throw createHttpError(503, 'AI service temporarily unavailable');
            }
            throw aiError;
        }

    } catch (error) {
        console.error('Error in startChat:', error);
        const statusCode = error.status || 500;
        const message = error.status ? error.message : 'Internal server error';
        
        res.status(statusCode).json({
            success: false,
            error: {
                message,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            }
        });
    }
};

/**
 * Send a message in an existing chat
 */
export const sendMessage = async (req, res, next) => {
    try {
        const { message, context } = req.body;
        const { sessionId } = req.params;
        const userId = req.user._id;

        if (!message) {
            throw createHttpError(400, 'Message is required');
        }

        if (!userId) {
            throw createHttpError(401, 'Authentication required');
        }

        console.log('Sending message:', { sessionId, userId });

        // Find existing chat
        const chat = await AIChat.findById(sessionId);
        if (!chat) {
            throw createHttpError(404, 'Chat session not found');
        }

        // Verify chat belongs to user
        if (chat.userId.toString() !== userId.toString()) {
            throw createHttpError(403, 'Not authorized to access this chat');
        }

        if (chat.status !== 'active') {
            throw createHttpError(400, 'Chat session is not active');
        }

        try {
            // Generate AI response with chat history context
            const aiResponse = await generateAIResponse(
                message,
                chat.topic,
                {
                    ...context,
                    chatHistory: chat.messages.slice(-5)  // Last 5 messages for context
                }
            );

            // Update chat with new messages
            chat.messages.push(
                { role: 'user', content: message },
                { role: 'assistant', content: aiResponse }
            );
            chat.lastInteraction = new Date();
            await chat.save();

            console.log('Message sent successfully');

            res.json({
                success: true,
                data: chat
            });
        } catch (aiError) {
            console.error('AI/Database error:', aiError);
            if (aiError.message.includes('OpenAI')) {
                throw createHttpError(503, 'AI service temporarily unavailable');
            }
            throw aiError;
        }

    } catch (error) {
        console.error('Error in sendMessage:', error);
        const statusCode = error.status || 500;
        const message = error.status ? error.message : 'Internal server error';
        
        res.status(statusCode).json({
            success: false,
            error: {
                message,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            }
        });
    }
};

/**
 * Get chat history for user
 */
export const getChatHistory = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const chats = await AIChat.find({ userId })
            .sort({ lastInteraction: -1 });

        res.status(200).json({
            success: true,
            data: chats
        });
    } catch (error) {
        console.error('Get chat history error:', error);
        next(error);
    }
};

/**
 * Get specific chat session
 */
export const getChatSession = async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user._id;

        const chat = await AIChat.findById(sessionId);
        if (!chat) {
            throw createHttpError(404, 'Chat session not found');
        }

        // Verify chat belongs to user
        if (chat.userId.toString() !== userId.toString()) {
            throw createHttpError(403, 'Not authorized to access this chat');
        }

        res.status(200).json({
            success: true,
            data: chat
        });
    } catch (error) {
        console.error('Get chat session error:', error);
        next(error);
    }
};

/**
 * Update chat session status
 */
export const updateChatStatus = async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user._id;

        validateChatUpdate(req.body);

        const chat = await AIChat.findById(sessionId);
        if (!chat) {
            throw createHttpError(404, 'Chat session not found');
        }

        // Verify chat belongs to user
        if (chat.userId.toString() !== userId.toString()) {
            throw createHttpError(403, 'Not authorized to access this chat');
        }

        if (req.body.status) {
            chat.status = req.body.status;
        }
        if (req.body.topic) {
            chat.topic = req.body.topic;
        }

        await chat.save();

        res.status(200).json({
            success: true,
            data: chat
        });
    } catch (error) {
        console.error('Update chat status error:', error);
        next(error);
    }
}; 