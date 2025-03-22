// src/controllers/aiChatController.js

import { createAIChat, getUserChatHistory, addMessageToChat } from '../service/AIChatservice.js';
import { formatChatHistory } from '../helpers/AIChathelper.js';

/**
 * Create a new AI chat interaction.
 */
export async function createChat(req, res) {
    try {
        const chatData = {
            userId: req.user._id, // Assuming user is attached by auth middleware
            messages: [{
                sender: 'user',
                content: req.body.content,
                prompt: req.body.prompt,
                response: req.body.response
            }],
            context: req.body.context
        };

        const newChat = await createAIChat(chatData);
        res.status(201).json(formatChatHistory(newChat));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Get chat history for the authenticated user.
 */
export async function getChatHistory(req, res) {
    try {
        const userId = req.user._id; // Assuming user is attached by auth middleware
        const chatHistory = await getUserChatHistory(userId);
        res.json(chatHistory.map(formatChatHistory));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Add a new message to an existing chat.
 */
export async function addMessage(req, res) {
    try {
        const { chatId } = req.params;
        const messageData = {
            sender: req.body.sender,
            content: req.body.content,
            prompt: req.body.prompt,
            response: req.body.response,
            createdAt: new Date()
        };

        const updatedChat = await addMessageToChat(chatId, messageData);
        res.json(formatChatHistory(updatedChat));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}