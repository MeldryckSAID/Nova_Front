class Url {
  private readonly _url: string

  constructor() {
    this._url = process.env.NEXT_PUBLIC_API_URL || ''
  }

  public get value(): string {
    return this._url
  }
}

export default new Url()
