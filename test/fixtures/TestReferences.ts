let _ = require('lodash');

import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';
import { Opener } from 'pip-services3-commons-node';
import { Closer } from 'pip-services3-commons-node';
import { Referencer } from 'pip-services3-commons-node';
import { ManagedReferences } from 'pip-services3-container-node';

import { IAccountsClientV1 } from '../../src/clients/version1/IAccountsClientV1';
import { AccountV1 } from '../../src/clients/version1/AccountV1';
import { IRolesClientV1 } from '../../src/clients/version1/IRolesClientV1';
import { UserRolesV1 } from '../../src/clients/version1/UserRolesV1';
import { ISessionsClientV1 } from '../../src/clients/version1/ISessionsClientV1';
import { SessionV1 } from '../../src/clients/version1/SessionV1';
import { ISitesClientV1 } from '../../src/clients/version1/ISitesClientV1';
import { SiteV1 } from '../../src/clients/version1/SiteV1';

import { SessionUserV1 } from '../../src/operations/version1/SessionUserV1';
import { TestUsers } from './TestUsers';
import { TestSites } from './TestSites';
import { ClientFacadeFactory } from '../../src/build/ClientFacadeFactory';
import { HttpEndpoint, DefaultRpcFactory } from 'pip-services3-rpc-node';
import { FacadeServiceV1 } from '../../src/services/version1/FacadeServiceV1';
import { FacadeServiceV2 } from '../../src/services/version2/FacadeServiceV2';
import { AccountsMemoryClientV1 } from '../../src/clients/version1/AccountsMemoryClientV1';
import { SessionsMemoryClientV1 } from '../../src/clients/version1/SessionsMemoryClientV1';
import { PasswordsNullClientV1 } from '../../src/clients/version1/PasswordsNullClientV1';
import { RolesMemoryClientV1 } from '../../src/clients/version1/RolesMemoryClientV1';
import { EmailSettingsMemoryClientV1 } from '../../src/clients/version1/EmailSettingsMemoryClientV1';
import { SitesMemoryClientV1 } from '../../src/clients/version1/SitesMemoryClientV1';

export class TestReferences extends ManagedReferences {
    private _factory = new ClientFacadeFactory();

    public constructor() {
        super();

        this.appendDependencies();
        this.configureService();
        this.createUsersAndSessions();
    }

    private appendDependencies() {
        // Add factories
        this.put(null, new ClientFacadeFactory());
        this.put(null, new DefaultRpcFactory());

        // Add service
        this.put(null, new FacadeServiceV1());
        this.put(null, new FacadeServiceV2());

        // Add services
        this.put(new Descriptor('pip-services-accounts', 'client', 'memory', 'default', '*'), new AccountsMemoryClientV1());
        this.put(new Descriptor('pip-services-sessions', 'client', 'memory', 'default', '*'), new SessionsMemoryClientV1());
        this.put(new Descriptor('pip-services-passwords', 'client', 'null', 'default', '*'), new PasswordsNullClientV1());
        this.put(new Descriptor('pip-services-roles', 'client', 'memory', 'default', '*'), new RolesMemoryClientV1());
        this.put(new Descriptor('pip-services-emailsettings', 'client', 'memory', 'default', '*'), new EmailSettingsMemoryClientV1());
        this.put(new Descriptor('pip-services-sites', 'client', 'direct', 'memory', '*'), new SitesMemoryClientV1());
    }

    private configureService(): void {
        // Configure Facade service
        let service = this.getOneRequired<HttpEndpoint>(
            new Descriptor('pip-services', 'endpoint', 'http', 'default', '*')
        );
        service.configure(ConfigParams.fromTuples(
            'root_path', '', //'/api/v1',
            'connection.protocol', 'http',
            'connection.host', '0.0.0.0',
            'connection.port', 3000
        ));
    }

    private createUsersAndSessions(): void {
        // Create accounts
        let accountsClient = this.getOneRequired<IAccountsClientV1>(
            new Descriptor('pip-services-accounts', 'client', '*', '*', '*')
        );

        let adminUserAccount = <AccountV1>{
            id: TestUsers.AdminUserId, 
            login: TestUsers.AdminUserLogin, 
            name: TestUsers.AdminUserName,
            active: true,
            create_time: new Date()
        };
        accountsClient.createAccount(null, adminUserAccount, () => {});

        let user1Account = <AccountV1>{
            id: TestUsers.User1Id, 
            login: TestUsers.User1Login, 
            name: TestUsers.User1Name,
            active: true,
            create_time: new Date()
        };
        accountsClient.createAccount(null, user1Account, () => {});

        let user2Account = <AccountV1>{
            id: TestUsers.User2Id, 
            login: TestUsers.User2Login, 
            name: TestUsers.User2Name,
            active: true,
            create_time: new Date()
        };
        accountsClient.createAccount(null, user2Account, () => {});

        // Create test site(s)
        let sitesClient = this.getOneRequired<ISitesClientV1>(
            new Descriptor('pip-services-sites', 'client', '*', '*', '*')
        );
        let site1 = <SiteV1>{
            id: TestSites.Site1Id, 
            name: TestSites.Site1Name
        };
        sitesClient.createSite(null, site1, () => {});

        // Create user roles
        let rolesClient = this.getOneRequired<IRolesClientV1>(
            new Descriptor('pip-services-roles', 'client', '*', '*', '*')
        );
        rolesClient.setRoles(
            null, TestUsers.AdminUserId, [ 'admin', TestSites.Site1Id + ':admin' ], () => {});
        rolesClient.setRoles(
            null, TestUsers.User1Id, [ TestSites.Site1Id + ':manager' ], () => {});
        rolesClient.setRoles(
            null, TestUsers.User2Id, [ TestSites.Site1Id + ':user' ], () => {});

        // Create opened sessions
        let sessionsClient = this.getOneRequired<ISessionsClientV1>(
            new Descriptor('pip-services-sessions', 'client', '*', '*', '*')
        );

        let adminUserData = _.clone(adminUserAccount);
        adminUserData.roles = [ 'admin', TestSites.Site1Id + ':admin' ];
        sessionsClient.openSession(
            null, TestUsers.AdminUserId, TestUsers.AdminUserName,
            null, null, adminUserData, null,
            (err, session) => { session.id = TestUsers.AdminUserSessionId });

        let user1Data = _.clone(user1Account);
        user1Data.roles = [ TestSites.Site1Id + ':manager' ];
        sessionsClient.openSession(
            null, TestUsers.User1Id, TestUsers.User1Name,
            null, null, user1Data, null,
            (err, session) => { session.id = TestUsers.User1SessionId });

        let user2Data = _.clone(user2Account);
        user2Data.roles = [ TestSites.Site1Id + ':user' ];
        sessionsClient.openSession(
            null, TestUsers.User2Id, TestUsers.User2Name,
            null, null, user2Data, null,
            (err, session) => { session.id = TestUsers.User2SessionId });
    }

}