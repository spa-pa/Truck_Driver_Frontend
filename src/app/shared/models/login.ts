export interface ILogin{
    userName: string;
    password: string;
    lat_long:any;
}

export interface IForgotPass{
    email_id?: string;
    password?: string;
    otp?:any;

}