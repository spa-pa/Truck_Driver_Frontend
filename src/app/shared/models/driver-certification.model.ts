// src/app/models/driver-certification.model.ts

export interface DriverCertification {
    driver_certification_id: number;
    certification_id: string;
    expiry_date: string;
    driver_id: number;
    full_name: string;
    mobile_number: string;
    driving_license_number: string;
    driving_license_expiry_date: string;
    is_active: boolean;
    created_by: string | null;
    created_at: string;
    modified_by: string | null;
    modified_at: string | null;
    deleted_by: string | null;
    deleted_at: string | null;
}

export interface CertificationResponse {
    data: DriverCertification;
    message?: string;
    success?: boolean;
}