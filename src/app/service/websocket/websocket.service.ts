import { Injectable } from '@angular/core';
import {webSocket, WebSocketSubject} from "rxjs/webSocket";
import {
  WebsocketEvent, WebsocketEventTypeMap, WebsocketEventTypes,
  WebsocketRequest,
  WebsocketRequestTypeMap,
  WebsocketRequestTypes
} from "../../type/websocket/websocket.interface";
import {filter, map, Observable, Subject, Subscription} from "rxjs";
import {Product} from "../../type/product/product";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public static readonly WEBSOCKET_ENDPOINT = "wsapi/product";
  private websocket?: WebSocketSubject<any>;
  private readonly webSocketEventSubject: Subject<WebsocketEvent> = new Subject();
  public readonly productUpdateSubject: Subject<Product> = new Subject<Product>();
  private websocketSubscription?: Subscription;


  constructor() {
    this.subscribeToEvent("ProductUpdateEvent").subscribe(productUpdateEvent => {
      const product = JSON.parse(productUpdateEvent.productUpdateRecord) as Product;
      this.productUpdateSubject.next(product);
    })
  }

  public websocketEvent(): Observable<WebsocketEvent> {
    return this.webSocketEventSubject;
  }

  public subscribeToEvent<T extends WebsocketEventTypes>(
    type: T
  ): Observable<{ type: T } & WebsocketEventTypeMap[T]> {
    return this.websocketEvent().pipe(
      filter(event => event.type === type),
      map(event => event as unknown as { type: T } & WebsocketEventTypeMap[T])
    );
  }

  public send<T extends WebsocketRequestTypes>(type: T, payload: WebsocketRequestTypeMap[T]): void {
    const request = {
      type,
      ...payload,
    } as any as WebsocketRequest;
    this.websocket?.next(request);
  }

  public openWebsocket(productColor: string) {
    const webSocketUrl = WebsocketService.getWebsocketUrl(WebsocketService.WEBSOCKET_ENDPOINT);
    this.websocket = webSocket<WebsocketRequest | WebsocketEvent>(webSocketUrl);
    this.websocketSubscription = this.websocket.subscribe(event => {
      this.webSocketEventSubject.next(event as WebsocketEvent);
    });
    this.send("QueryRequest", {productColor});
  }

  public closeWebsocket() {
    this.websocketSubscription?.unsubscribe();
    this.websocket?.complete();
  }

  private static getWebsocketUrl(endpoint): string {
    const websocketUrl = new URL(endpoint, document.baseURI);
    // replace protocol, so that http -> ws, https -> wss
    websocketUrl.protocol = websocketUrl.protocol.replace("http", "ws");
    return websocketUrl.toString();
  }
}
