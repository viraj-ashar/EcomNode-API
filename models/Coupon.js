import mongoose from "mongoose";

const Schema = mongoose.Schema;

const couponSchema = new Schema(
    {
        code: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        discount: {
            type: Number,
            required: true,
            default: 0
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true
        }
    }
);

couponSchema.virtual('isExpired').get(function () {
    return this.endDate < Date.now();
})
couponSchema.virtual('daysLeft').get(function () {
    const daysLeft = Math.max(0, Math.ceil((this.endDate - Date.now()) / (1000 * 60 * 60 * 24))) + ' Days Left';
    return daysLeft;
})

couponSchema.pre('validate', function (next) {
    if (this.endDate < this.startDate)
        next(new Error("End date can't bew lesser than starting date."));
    if (this.discount <= 0 || this.discount > 100)
        next(new Error("Discount can't be less than 0 or greater than 100."));
    if (Date.now() > this.startDate)
        next(new Error("Start date can't be less than today."));

    next();
});

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;