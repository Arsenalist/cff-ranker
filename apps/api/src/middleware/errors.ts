import { MultiMessageError } from '../multi-message-error';

const handleErrors = (err, req, res, next) => {
  let messages
  if (err instanceof MultiMessageError) {
    messages = err.errorMessages
  } else {
    messages = [err.message]
  }
  res.status(500).json({
    messages: messages
  });
  next(err)
};

export { handleErrors }
