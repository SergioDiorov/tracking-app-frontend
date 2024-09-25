export interface IResponse<T> {
  data: T;
}

export interface IMessageResponse<T> extends IResponse<T> {
  message: string;
}

export interface IResponsePagination<T> {
  data: T;
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  }
}

export interface IPaginationData {
  limit: number;
  page: number;
}
