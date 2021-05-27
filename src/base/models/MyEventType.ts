export type MyEventType = {
    originalEvent: Event, value: any,
    target: { name: string, id: string, value: any }
};

export type MyCheckboxEventType = {
    originalEvent: Event; value: any; checked: boolean;
    target: {
        type: string; name: string; id: string; value: any; checked: boolean;
    }
};