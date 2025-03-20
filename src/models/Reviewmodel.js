const reviewSchema = new Schema({
    reviewerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    entityId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    entityType: {
        type: String,
        enum: ['Doctor', 'Service', ],
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    comment: {
        type: String,
        maxlength: 500,
    },
}, {
    timestamps: true,
});