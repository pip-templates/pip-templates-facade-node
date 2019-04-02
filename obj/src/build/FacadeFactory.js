"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const FacadeServiceV1_1 = require("../services/version1/FacadeServiceV1");
const FacadeServiceV2_1 = require("../services/version2/FacadeServiceV2");
class FacadeFactory extends pip_services3_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(FacadeFactory.FacadeServiceV1Descriptor, FacadeServiceV1_1.FacadeServiceV1);
        this.registerAsType(FacadeFactory.FacadeServiceV2Descriptor, FacadeServiceV2_1.FacadeServiceV2);
    }
}
FacadeFactory.FacadeServiceV1Descriptor = new pip_services3_commons_node_1.Descriptor("pip-facade-sample", "service", "http", "*", "1.0");
FacadeFactory.FacadeServiceV2Descriptor = new pip_services3_commons_node_1.Descriptor("pip-facade-sample", "service", "http", "*", "2.0");
exports.FacadeFactory = FacadeFactory;
//# sourceMappingURL=FacadeFactory.js.map