/**
 * Format message content for storage or display.
 * @param {Array} content - Array of content objects.
 * @returns {Array} - Formatted content array.
 */
export function formatMessageContent(content) {
    return content.map(item => ({
        type: item.type,
        data: item.data
    }));
}

/**
 * Validate message content type.
 * @param {string} type - Content type to validate.
 * @returns {boolean} - Whether the type is valid.
 */
export function isValidContentType(type) {
    return ['text', 'audio', 'video', 'image'].includes(type);
}

/**
 * Format chat history for display.
 * @param {Object} chat - Chat interaction object.
 * @returns {Object} - Formatted chat data.
 */
export function formatChatHistory(chat) {
    return {
        id: chat._id,
        userId: chat.userId,
        messages: chat.messages.map(msg => ({
            sender: msg.sender,
            content: msg.content,
            prompt: msg.prompt,
            response: msg.response,
            timestamp: msg.createdAt
        })),
        context: chat.context,
        createdAt: chat.createAt
    };
}

/**
 * Format chat message for medical context.
 * @param {Object} message - The chat message.
 * @returns {Object} - Formatted message with medical context.
 */
export function formatMedicalMessage(message) {
    return {
        role: message.role,
        content: message.content,
        medicalContext: message.medicalContext || {},
        timestamp: message.timestamp
    };
}

/**
 * Extract medical terms from message content.
 * @param {string} content - Message content.
 * @returns {Object} - Extracted medical context.
 */
export function extractMedicalContext(content) {
    return {
        symptoms: extractSymptoms(content),
        conditions: extractConditions(content),
        medications: extractMedications(content)
    };
}

/**
 * Validate medical emergency keywords.
 * @param {string} content - Message content.
 * @returns {boolean} - Whether message contains emergency keywords.
 */
export function isEmergencyMessage(content) {
    const emergencyKeywords = [
        'heart attack', 'stroke', 'bleeding', 'unconscious',
        'difficulty breathing', 'severe pain'
    ];
    return emergencyKeywords.some(keyword => 
        content.toLowerCase().includes(keyword)
    );
}

/**
 * Categorize medical query.
 * @param {string} content - Message content.
 * @returns {string} - Query category.
 */
export function categorizeMedicalQuery(content) {
    const categories = {
        diagnosis: ['symptoms', 'feeling', 'pain', 'diagnosed'],
        medication: ['medicine', 'drug', 'prescription', 'dose'],
        lifestyle: ['diet', 'exercise', 'sleep', 'stress'],
        emergency: ['emergency', 'urgent', 'severe']
    };

    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => content.toLowerCase().includes(keyword))) {
            return category;
        }
    }
    return 'general';
}