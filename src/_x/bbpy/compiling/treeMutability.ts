

import * as BBP from "_x/bbpy/all" ;











import * as XMD from "@xmldom/xmldom" ;

;

;

namespace main {

  export function create(...args: Parameters<Impl["newDerived"]> ) {
    return Impl.sharedSeed.newDerived(...args) ;
  }

}

class Impl {
  
  static newFor(...args: [
    Document, 
    Impl.Options ,
  ]): Impl ;
  static newFor(...[impl, domainOptions]: [Document, Impl.Options]): Impl {
    return (
      new Impl(impl.implementation, impl, {
        ...domainOptions ,
      })
    ) ;
  }

  newDerived(options: Impl.Options) {
    return Impl.newFor(this.dc, options) ;
  }

  /** 
   * the "peer" (JDK's AWT/Swing uses the term "peer" for analogous stuffs)
   * 
   */
  peer !: Element ; 
  protected constructor(
    protected impl: DOMImplementation,
    protected dc: Document ,
    options: (
      & { 
      }
      & Impl.Options
    ) ,
  ) {
    const {
      tagName ,
    } = options ;
    ;
    this.peer = (
      dc.createElement(tagName)
    ) ;
    BBP.impl.Debug.ok((
      Impl.peerBackmapping.has(this.peer) === false
    ) ) ;
    Impl.peerBackmapping.set(this.peer, this) ;
  }
  protected static peerBackmapping = (
    new WeakMap<Element, Impl>()
  ) ;

  addIntoParent(dest: Impl): void ;
  addIntoParent(destWrapper: Impl): void {
    destWrapper.peer.appendChild(this.peer ) ;
  }

  appendChild(i: number, addend: Impl): void ;
  appendChild(i: number, addendWrapper: Impl): void {
    this.peer.insertBefore(addendWrapper.peer, (
      this.peer.children[i] ?? null
    )) ;
  }

  /** 
   * the inverse/reverse of the query `this.peer`
   */
  static backpeerOf(e: Element): Impl;
  static backpeerOf(e: Element): Impl {
    const e1 = this.peerBackmapping.get(e) ;
    BBP.impl.Debug.ok(e1) ;
    return e1 ;
  }

  getChildren(): Impl[] {
    return (
      Array.from(this.peer.children )
      .map(e => Impl.backpeerOf(e) )
    ) ;
  }
  getParent(): Impl {
    const r1 = this.peer ;
    const r2 = r1.parentElement ;
    const r3 = (
      r2 && Impl.backpeerOf(r2)
    ) ;
    BBP.impl.Debug.ok(r3) ;
    return (
      r3
    ) ;
  }

}
namespace Impl {
  export type Dc = Impl["dc"] ;
  export type Options = (
    & { 
    }
    & {
      tagName: string ;
    }
  ) ;
}
namespace Impl {
  export const sharedSeed: (
    Pick<Impl, "newDerived">
  ) = (
    Impl.newFor((
      new XMD.DOMImplementation().createDocument(null, null)
    ), {
      tagName: "expression" ,
    })
  ) ;
}

/* avoid the `export * from` syntax */
export = main ;

