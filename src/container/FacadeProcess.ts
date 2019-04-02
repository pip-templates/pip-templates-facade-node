import { IReferences } from 'pip-services3-commons-node';
import { ProcessContainer } from 'pip-services3-container-node';
import { DefaultRpcFactory } from 'pip-services3-rpc-node';

import { ClientFacadeFactory } from '../build/ClientFacadeFactory';
import { FacadeFactory } from '../build/FacadeFactory';

export class FacadeProcess extends ProcessContainer {

    public constructor() {
        super("pip-facades-sample", "Sample facade for pip-services");
        this._factories.add(new ClientFacadeFactory);
        this._factories.add(new FacadeFactory);
        this._factories.add(new DefaultRpcFactory);
    }

}
