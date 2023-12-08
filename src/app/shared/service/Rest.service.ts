import { Observable } from "rxjs";
import HttpClientUtils from "../model/HttpClientUtils.model";
import { HttpClient } from "@angular/common/http";
import { UtilsService } from "./Utils.service";

export abstract class RestService<T extends Object>{

    constructor(
        protected httpClient: HttpClient
    ) { }

    protected abstract getURL(): string;
    protected abstract getPrefixes(): string[];

    protected getPrefixPath(): string {
        let prefixes = this.getPrefixes();
        let path = "";
        prefixes.forEach(e => {
            path += `/${e}`;
        });
        return path;
    }

    public getAnyMatch(object: T): Observable<T[]> {
        let params = HttpClientUtils.toHttpParams(object);
        return this.httpClient.get<T[]>(`${this.getURL()}${this.getPrefixPath()}/match_any`, { params: params });
    }

    public getAllMatch(object: T): Observable<T[]> {
        let params = HttpClientUtils.toHttpParams(object);
        return this.httpClient.get<T[]>(`${this.getURL()}${this.getPrefixPath()}/match_all`, { params: params });
    }

    public getAnyMatchWithMatchCase(object: T, matchCase: string): Observable<T[]> {
        let params = HttpClientUtils.toHttpParams(object);
        return this.httpClient.get<T[]>(`${this.getURL()}${this.getPrefixPath()}/match_any/${matchCase}`, { params: params });
    }

    public getAllMatchWithMatchCase(object: T, matchCase: string): Observable<T[]> {
        let params = HttpClientUtils.toHttpParams(object);
        return this.httpClient.get<T[]>(`${this.getURL()}${this.getPrefixPath()}/match_all/${matchCase}`, { params: params });
    }

    public getAll(): Observable<T[]> {
        return this.httpClient.get<T[]>(`${this.getURL()}${this.getPrefixPath()}`);
    }

    public get(id: any): Observable<T> {
        return this.httpClient.get<T>(`${this.getURL()}${this.getPrefixPath()}/${id}`);
    }

    public post(object: T): Observable<T> {
        return this.httpClient.post<T>(`${this.getURL()}${this.getPrefixPath()}`, object);
    }

    public put(id: any, object: T): Observable<T> {
        return this.httpClient.put<T>(`${this.getURL()}${this.getPrefixPath()}/${id}`, object);
    }

    public patch(id: any, object: T): Observable<T> {
        return this.httpClient.patch<T>(`${this.getURL()}${this.getPrefixPath()}/${id}`, object);
    }

    public delete(id: any): Observable<void> {
        return this.httpClient.delete<void>(`${this.getURL()}${this.getPrefixPath()}/${id}`);
    }

    public async getAsync(id: any, nextFn?: (value: T) => void, errorFn?: (error: any) => void) {
        return UtilsService.ObservableToPromise(this.get(id), nextFn, errorFn);
    }

    public async getAllAsync(nextFn?: (value: T[]) => void, errorFn?: (error: any) => void) {
        return UtilsService.ObservableToPromise(this.getAll(), nextFn, errorFn);
    }
}