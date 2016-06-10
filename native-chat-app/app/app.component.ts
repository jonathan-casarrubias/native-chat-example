import { Component } from "@angular/core";
import { HTTP_PROVIDERS } from '@angular/http';
import { LoopBackConfig, UserApi, RoomApi } from './sdk';

@Component({
    selector: "my-app",
    template: `
<StackLayout>
    <Label text="Real Time App" class="title"></Label>
</StackLayout>
`,
    providers: [HTTP_PROVIDERS, UserApi, RoomApi]
})

export class AppComponent {
    constructor(private room: RoomApi) {
        // or local network IP or public IP/DNS
        LoopBackConfig.setBaseURL('http://192.168.100.5:3000');
        LoopBackConfig.setApiVersion('api');
        room.createIO().subscribe((res: { id: number | string, name: string }) => {
            alert(res.name);
        });
    }
}