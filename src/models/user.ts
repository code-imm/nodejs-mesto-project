import bcrypt from 'bcryptjs';
import mongoose, { Document, Model, Schema } from 'mongoose';
import validator from 'validator';
import UnauthorizedError from '../shared/errors/UnauthorizedError';
import validateURL from '../shared/utils/validateURL';

export interface IUser {
  email: string;
  password: string;
  name: string;
  about: string;
  avatar: string;
}

export interface IUserDocument extends IUser, Document {}

export interface IUserModel extends Model<IUserDocument> {
  findUserByCredentials(
    email: string,
    password: string,
  ): Promise<IUserDocument>;
}

const userSchema = new Schema<IUserDocument, IUserModel>({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return validateURL(v);
      },
    },
  },
});

const errorMessages = {
  unauthorizedError: 'Неправильные почта или пароль',
};

userSchema.static(
  'findUserByCredentials',
  async function findUserByCredentials(email: string, password: string) {
    const user = await this.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError(errorMessages.unauthorizedError);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError(errorMessages.unauthorizedError);
    }
  },
);

export default mongoose.model<IUserDocument, IUserModel>('User', userSchema);
