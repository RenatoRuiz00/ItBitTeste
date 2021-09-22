"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routing = void 0;
var router_1 = require("@angular/router");
var home_component_1 = require("./components/home.component");
var usuario_component_1 = require("./components/usuario.component");
var appRoutes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: home_component_1.HomeComponent },
    { path: 'usuario', component: usuario_component_1.UsuarioComponent },
];
exports.routing = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map