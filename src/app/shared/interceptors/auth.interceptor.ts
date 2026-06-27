import { Injectable } from "@angular/core";
import {
    HttpInterceptor,
    HttpEvent,
    HttpResponse,
    HttpRequest,
    HttpHandler,
    HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Router } from "@angular/router";


import { EncryptedStorage } from "@shared/utils/encrypted-storage";
import { GlobalConfig } from "@shared/configs/global-config";
import { EncryptionAPILayer } from "@shared/utils/encryption-api";
import { responseMessages } from "@shared/constants/response-msgs.constant";
import { ToastService } from "@shared/services/toast.service";
import { environment } from "@environments/environment";


@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {

    private encryptionLayer = new EncryptionAPILayer();
    private encryptedStorage = new EncryptedStorage();
    private globalConfig = new GlobalConfig();

    constructor(
        private router: Router,
        private toastService: ToastService
    ) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {

        // Skip translation files
        if (request.url.includes("/assets/i18n/")) {
            return next.handle(request);
        }

        const authToken = this.encryptedStorage.findItemFromAllStorage(
            this.globalConfig.authToken
        );

        let modifiedRequest = request;

        // Encrypt request body
        if (
            environment.ENABLE_ENCRYPTION &&
            request.body &&
            !(request.body instanceof FormData)
        ) {
            modifiedRequest = request.clone({
                body: {
                    reqBody: this.encryptionLayer.encryptData(request.body)
                }
            });
        }

        // Attach token
        if (authToken) {
            modifiedRequest = modifiedRequest.clone({
                setHeaders: {
                    "x-access-token": authToken
                }
            });
        }

        return next.handle(modifiedRequest).pipe(
            map(event => this.handleSuccess(event)),
            catchError(error => this.handleError(error, modifiedRequest.url))
        );
    }


    private handleSuccess(event: HttpEvent<any>): HttpEvent<any> {

        if (!(event instanceof HttpResponse)) {
            return event;
        }

        let responseBody = event.body;

        try {

            if (
                environment.ENABLE_ENCRYPTION &&
                responseBody?.resBody
            ) {
                responseBody = this.encryptionLayer.decryptData(
                    responseBody.resBody
                );
            }

            // if (
            //     responseBody?.code &&
            //     !responseBody?.success
            // ) {

            //     const message =
            //         responseMessages.codes.find(
            //             x => x.code === responseBody.code
            //         )?.message
            //         || "Something went wrong, please try again later";

            //     this.toastService.open(message, "error");
            // }

            return event.clone({
                body: responseBody
            });

        } catch {

            return event.clone({
                body: responseBody
            });

        }
    }


    private handleError(
        err: HttpErrorResponse,
        url: string
    ): Observable<never> {

        let errorData: any = {};

        try {

            if (
                environment.ENABLE_ENCRYPTION &&
                err?.error?.resBody
            ) {

                errorData = this.encryptionLayer.decryptData(
                    err.error.resBody
                );

            }
            else if (err?.error) {

                errorData = err.error;

                if (!errorData.error_message) {
                    errorData.error_message = err.message;
                }
            }

        }
        catch {

            errorData = {
                error_message: "Unknown Error"
            };

        }


        switch (err.status) {

            case 401:
            case 403:

                this.timeoutSessionLogoutUser();
                break;


            case 404:

                this.toastService.open(
                    "Not found",
                    "info"
                );

                break;


            default:

                if (errorData?.error_message === "1.0005") {

                    this.unauthorizedUserLogin(url);

                } else {

                    // const message =
                    //     responseMessages.codes.find(
                    //         x => x.code === errorData?.error_message
                    //     )?.message
                    //     || "Something went wrong, please try again later";


                    // if (err.status !== 400) {
                    //     this.toastService.open(
                    //         message,
                    //         "error"
                    //     );
                    // }

                }

                break;
        }

        return throwError(() => errorData);
    }



    private timeoutSessionLogoutUser(): void {

        this.toastService.open(
            "Your session has expired. Please log in again.",
            "info"
        );

        this.encryptedStorage.clearAll();

        this.router.navigate([
            this.globalConfig.loginRoute
        ]).then(() => {

            window.location.reload();

        });

    }



    private unauthorizedUserLogin(url: string): void {

        if (url.endsWith("/api/v1/login")) {
            return;
        }

        this.toastService.open(
            "Unauthorized! Please check your credentials or contact the system administrator.",
            "info"
        );

        this.encryptedStorage.clearAll();

        this.router.navigate([
            this.globalConfig.loginRoute
        ]).then(() => {

            window.location.reload();

        });

    }

}