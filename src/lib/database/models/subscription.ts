import { Schema, model, models, Model } from 'mongoose';
import { transformIdField } from '..';

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
		toJSON: {
			versionKey: false,
			transform: (doc, ret) => transformIdField(ret),
		},
	}
);

const Subscription: Model<ISubscription> =
	models.Subscription || model<ISubscription>('Subscription', SubscriptionSchema);

export default Subscription;
