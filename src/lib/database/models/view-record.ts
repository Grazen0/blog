import { Types, Schema, model, models, Model } from 'mongoose';

export interface IViewRecord {
	_id: string;
	post: Types.ObjectId;
	date: Date;
}

const ViewRecordSchema = new Schema({
	address: { type: String, required: true },
	post: { type: Types.ObjectId, ref: 'Post', required: true },
	date: { type: Date, required: true, default: () => new Date() },
});

ViewRecordSchema.index({ post: 1, address: 1 }, { unique: true });

const ViewRecord: Model<IViewRecord> =
	models.ViewRecord || model<IViewRecord>('ViewRecord', ViewRecordSchema);

export default ViewRecord;
