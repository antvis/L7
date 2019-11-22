import fork from "./fork";
import { Omit } from "./types";
import { ASTNode, Type, AnyType, Field } from "./lib/types";
import { NodePath } from "./lib/node-path";
import { NamedTypes } from "./gen/namedTypes";
import { Builders } from "./gen/builders";
import { Visitor } from "./gen/visitor";
declare type GenTypes = {
    namedTypes: NamedTypes;
    builders: Builders;
    visit<M = {}>(node: ASTNode, methods?: Visitor<M> & M): any;
};
declare type Main = Omit<ReturnType<typeof fork>, keyof GenTypes> & GenTypes;
declare const main: Main;
export default main;
export { ASTNode, Type, AnyType, Field, NodePath, NamedTypes, Builders, Visitor, };
