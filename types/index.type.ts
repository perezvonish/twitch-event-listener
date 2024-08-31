const TwitchEventType = {
    isTrusted: false,
    detail: {
        event: {
            avatar: "https://cdn.streamelements.com/assets/dashboard/my-overlays/overlay-default-preview-2.jpg",
            displayName: "Cele",
            name: "cele",
            originalEventName: "follower-latest",
            providerId: "101690245",
            sessionTop: false,
            type: "follower",
            _id: "6d63491f68af864f6c4fce39",
            listener: "follower-latest"
        }
    },
    bubbles: false,
    cancelBubble: false,
    cancelable: false,
    composed: false,
    currentTarget: {
        window: {
            Window: "Window",
            document: "document",
            name: "",
            location: "Location"
        }
    },
    defaultPrevented: false,
    eventPhase: 0,
    returnValue: true,
    srcElement: {
        window: {
            Window: "Window",
            document: "document",
            name: "",
            location: "Location"
        }
    },
    target: {
        window: {
            Window: "Window",
            document: "document",
            name: "",
            location: "Location"
        }
    },
    timeStamp: 6511.5,
    type: "onEventReceived"
};

export type TwitchEvent = {
    isTrusted: boolean,
    detail: {
        event: {
            avatar: string,
            displayName: string,
            name: string,
            originalEventName: string,
            providerId: string, //long_number
            sessionTop: boolean,
            type: string,
            _id: string, //uuid
            listener: string,
            data: {
                displayName: string,
                username: string,
                amount?: number,
                gifted?: boolean,
                sender?: string,
                message?: string
            }
        },
        listener: string
    },
    bubbles: boolean,
    cancelBubble: boolean,
    cancelable: boolean,
    composed: boolean,
    defaultPrevented: boolean,
    eventPhase: number,
    returnValue: boolean,
    type: string
};

export const TwitchActionType = {
    follower: "follower",
    subscriber: "subscriber",
    tip: "tip",
    cheer: "cheer",
    raid: "raid",
    redemption: "redemption",
    merch: "merch",
    charityCampaignDonation: "charityCampaignDonation"
} as const

export type TwitchActionType = (typeof TwitchActionType)[keyof typeof TwitchActionType]