class MultiMessageError extends Error {
  _errorMessages: string[] = []
  constructor(errorMessages) {
    super("MultiMessageError");
    this.name = "MultiMessageError";
    this._errorMessages = errorMessages
  }

  get errorMessages() {
    return this._errorMessages
  }
}

export { MultiMessageError }
