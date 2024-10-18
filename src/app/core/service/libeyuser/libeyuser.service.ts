import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { LibeyUser } from "src/app/entities/libeyuser";
import { DocumentType1 } from "src/app/entities/DocumentType1";
import { Region } from "src/app/entities/Region";
import { Province } from "src/app/entities/Province";
import { Ubigeo } from "src/app/entities/Ubigeo";
@Injectable({
	providedIn: "root",
})
export class LibeyUserService {
	constructor(private http: HttpClient) {}

	Find(documentNumber: string): Observable<LibeyUser> {
		const uri = `${environment.pathLibeyTechnicalTest}LibeyUser/${documentNumber}`;
		return this.http.get<LibeyUser>(uri);
	}

  getAllDocumentTypes(): Observable<DocumentType1[]> {
		const uri = `${environment.pathLibeyTechnicalTest}LibeyUser/GetAllDocumentTypes`;
		return this.http.get<DocumentType1[]>(uri);
  }

  getAllRegions(): Observable<Region[]> {
		const uri = `${environment.pathLibeyTechnicalTest}LibeyUser/GetAllRegions`;
		return this.http.get<Region[]>(uri);
  }

  getProvincesByCode(code :string): Observable<Province[]> {
		const uri = `${environment.pathLibeyTechnicalTest}LibeyUser/GetProvincesByCode?regionCode=${code}`;
		return this.http.get<Province[]>(uri);
  }

  getUbigeosByCode(regioncode :string,provinceCode :string): Observable<Ubigeo[]> {
		const uri = `${environment.pathLibeyTechnicalTest}LibeyUser/GetUbigeosByCode?provinceCode=${provinceCode}&regionCode=${regioncode}`;
		return this.http.get<Ubigeo[]>(uri);
  }

  createClient(request : LibeyUser): Observable<number> {
    debugger;
		const uri = `${environment.pathLibeyTechnicalTest}LibeyUser/CreateClient`;
		return this.http.post<number>(uri,request);
  }
}
