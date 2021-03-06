import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { flatMap, catchError, map } from 'rxjs/operators';

import { CategoryService } from '../../categories/shared/category.service';

import { Entry } from './entry.model';

@Injectable({
    providedIn: 'root'
})

export class EntryService {

    // tslint:disable-next-line: no-inferrable-types
    private apiPath: string = 'api/entries';

    constructor(private http: HttpClient, private categoryService: CategoryService) { }

    getAll(): Observable<Entry[]> {
        return this.http.get(this.apiPath).pipe(
            catchError(this.handlerError),
            map(this.jsonDataToEntries)
        );
    }

    getById(id: number): Observable<Entry> {
        const url = `${this.apiPath}/${id}`;

        return this.http.get(url).pipe(
            catchError(this.handlerError),
            map(this.jsonDataToEntry)
        );
    }

    create(entry: Entry): Observable<Entry> {
        // Map seria Observable<Observable<Entry>>
        return this.categoryService.getById(entry.categoryId).pipe(
            flatMap(category => {
                entry.category = category;
                // FlatMap = Observable<Entry>
                return this.http.post(this.apiPath, entry).pipe(
        catchError(this.handlerError),
        map(this.jsonDataToEntry));
            })
        );


    }

    update(entry: Entry): Observable<Entry> {
        const url = `${this.apiPath}/${entry.id}`;
        return this.categoryService.getById(entry.categoryId).pipe(
            flatMap(category => {
                entry.category = category;
                return this.http.put(url, entry).pipe(
                    catchError(this.handlerError),
                    map(() => entry)
                );
            })
        );
    }

    delete(entry: Entry): Observable<any> {
        const url = `${this.apiPath}/${entry.id}`;

        return this.http.delete(url).pipe(
            catchError(this.handlerError),
            map(() => console.log('Apagada com sucesso'))
        );
    }

    // PRIVATE METHODS
    private jsonDataToEntries(jsonData: any[]): Entry[] {
        const entries: Entry[] = [];

        jsonData.forEach(element => {
            const entry = Object.assign(new Entry(), element);
            entries.push(entry);
        });
        return entries;

    }

    private jsonDataToEntry(jsonData: any): Entry {
        return Object.assign(new Entry(), jsonData);
    }

    private handlerError( error: any): Observable<any> {
        console.log('ERRO NA REQUISI????O => ', error);
        return throwError(error);
    }
}
