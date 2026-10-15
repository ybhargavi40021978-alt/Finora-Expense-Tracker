const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    title: {
      type: String,
      required: [true, 'Expense title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters long'],
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    amount: {
      type: Number,
      required: [true, 'Expense amount is required'],
      min: [0.01, 'Amount must be greater than zero'],
      validate: {
        validator: Number.isFinite,
        message: 'Amount must be a valid finite number'
      }
    },
    category: {
      type: String,
      required: [true, 'Expense category is required'],
      trim: true,
      default: 'Food & Dining'
    },
    date: {
      type: Date,
      required: [true, 'Expense date is required'],
      default: Date.now,
      index: true
    },
    paymentMethod: {
      type: String,
      trim: true,
      default: 'UPI'
    },
    paidFrom: {
      type: String,
      trim: true,
      default: 'Primary Bank Account'
    },
    account: {
      type: String,
      trim: true,
      default: 'Primary Bank Account'
    },
    merchant: {
      type: String,
      trim: true,
      maxlength: [120, 'Merchant name cannot exceed 120 characters'],
      default: ''
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
    hasReceipt: {
      type: Boolean,
      default: false
    },
    receiptFileName: {
      type: String,
      trim: true,
      default: null
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
    isEssential: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      enum: ['expense'],
      default: 'expense',
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

// Pre-save hook: ensure account matches paidFrom
expenseSchema.pre('save', function () {
  if (this.paidFrom && !this.account) {
    this.account = this.paidFrom;
  } else if (this.account && !this.paidFrom) {
    this.paidFrom = this.account;
  }
});

// Indexes for query performance
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ userId: 1, category: 1, date: -1 });
expenseSchema.index({ date: -1 });
expenseSchema.index({ category: 1, date: -1 });
expenseSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Expense', expenseSchema);
