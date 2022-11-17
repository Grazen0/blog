import { Schema, model, models, Model } from 'mongoose';

export interface ISubscription {
	email: string;
	createdAt: Date;
}

const SubscriptionSchema = new Schema(
	{
		email: { type: String, required: true, trim: true, unique: true },
	},
	{
		timestamps: { createdAt: true, updatedAt: false },
	}
);

const Subscription: Model<ISubscription> =
	models.Subscription || model<ISubscription>('Subscription', SubscriptionSchema);

export default Subscription;
