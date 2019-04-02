import { ConfigParams } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

import { EmailSettingsV1 } from './EmailSettingsV1';

export interface IEmailSettingsClientV1 {
    getSettingsByIds(correlationId: string, recipientIds: string[],
        callback: (err: any, settings: EmailSettingsV1[]) => void): void;

    getSettingsById(correlationId: string, recipientId: string,
        callback: (err: any, settings: EmailSettingsV1) => void): void;

    getSettingsByEmailSettings(correlationId: string, email: string,
        callback: (err: any, settings: EmailSettingsV1) => void): void;

    setSettings(correlationId: string, settings: EmailSettingsV1,
        callback?: (err: any, settings: EmailSettingsV1) => void): void;

    setVerifiedSettings(correlationId: string, settings: EmailSettingsV1,
        callback?: (err: any, settings: EmailSettingsV1) => void): void;

    setRecipient(correlationId: string, recipientId: string,
        name: string, email: string, language: string,
        callback?: (err: any, settings: EmailSettingsV1) => void): void;

    setSubscriptions(correlationId: string, recipientId: string, subscriptions: any,
        callback?: (err: any, settings: EmailSettingsV1) => void): void;

    deleteSettingsById(correlationId: string, recipientId: string,
        callback?: (err: any) => void): void;

    resendVerification(correlationId: string, recipientId: string,
        callback?: (err: any) => void): void;

    verifyEmail(correlationId: string, recipientId: string, code: string,
        callback?: (err: any) => void): void;
}
