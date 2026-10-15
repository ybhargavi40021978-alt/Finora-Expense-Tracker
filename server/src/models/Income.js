const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    title: {
      type: String,
      required: [true, 'Income title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters long'],
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    amount: {
      type: Number,
      required: [true, 'Income amount is required'],
      min: [0.01, 'Amount must be greater than zero'],
      validate: {
        validator: Number.isFinite,
        message: 'Amount must be a valid finite number'
      }
    },
    category: {
      type: String,
      required: [true, 'Income category / source is required'],
      trim: true,
      default: 'Salary'
    },
    source: {
      type: String,
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Income date is required'],
      default: Date.now,
      index: true
    },
    paymentMethod: {
      type: String,
      trim: true,
      default: 'Bank Transfer'
    },
    account: {
      type: String,
      trim: true,
      default: 'Primary Bank Account'
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: ''
    },
    tags: {
      type: [String],
      default: []
    },
    isRecurring: {
      type: Boolean,
      default: false
    },
    recurrence: {
      frequency: { type: String, enum: ['Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Quarterly', 'Yearly', null], default: null },
      startDate: { type: Date, default: null },
      endDate: { type: Date, default: null }
    },
    includeInReports: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      enum: ['income'],
      default: 'income',
      immutable: true
    },
    status: {
      type: String,
      enum: ['Completed', 'Pending', 'Failed'],
      default: 'Completed'
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Pre-save hook: ensure source matches category if source was provided
incomeSchema.pre('save', function () {
  if (this.source && !this.category) {
    this.category = this.source;
  } else if (this.category && !this.source) {
    this.source = this.category;
  }
});

// Indexes for optimized filtering and summaries
incomeSchema.index({ userId: 1, date: -1 });
incomeSchema.index({ userId: 1, category: 1, date: -1 });
incomeSchema.index({ date: -1 });
incomeSchema.index({ category: 1, date: -1 });
incomeSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Income', incomeSchema);
