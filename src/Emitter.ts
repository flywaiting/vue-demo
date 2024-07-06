export namespace Emitter {
    // type 
    let map:Map<string, [Function, any][]>;

    export function on(type:string, fn:Function, ctx?:any){
        if (!map) map = new Map();
        if (map.has(type)) {
            map.get(type)?.push([fn, ctx]);
            return;
        }
        map.set(type, [[fn, ctx]]);
    }

    export function off(type:string, fn:Function){
        if (!map.has(type)) return false;
        const list = map.get(type)??[];
        for(let i = list.length-1;i>=0;i--){
            if (list[i][0] === fn) list.splice(i, 1);
        }
        return true;
    }

    export function rm(type:string) {
        return map.delete(type);
    }

    export function emit(type:string, ...args:any[]){
        if (!map.has(type))return;
        map.get(type)?.forEach(e=>e[0].call(e[1], ...args));
    }
}