export interface ResponseInterface<T> {
    code: string;
    message: string;
    data: T;
}
