
let eventsLimit = 5,
    userLocale = "en-US",
    includeFollowers = true,
    includeRedemptions = true,
    includeHosts = true,
    minHost = 0,
    includeRaids = true,
    minRaid = 0,
    includeSubs = true,
    includeTips = true,
    minDonate = 0,
    includeCheers = true,
    direction = "top",
    textOrder = "nameFirst",
    minCheer = 0;

let userCurrency,
    totalEvents = 0;

window.addEventListener('onEventReceived', function (obj: TwitchEvent) {
    if (!obj.detail.event) {
        return;
    }
    if (typeof obj.detail.event.itemId !== "undefined") {
        obj.detail.listener = "redemption-latest"
    }

    const listener = obj.detail.listener.split("-")[0];
    const event = obj.detail.event;


    if (totalEvents > eventsLimit) {
        removeEvent(totalEvents - eventsLimit);
    }
    getActionType(event)

});

window.addEventListener('onWidgetLoad', function (obj) {
    let recents = obj.detail.recents;
    recents.sort(function (a, b) {
        return Date.parse(a.createdAt) - Date.parse(b.createdAt);
    });
    userCurrency = obj.detail.currency;
    const fieldData = obj.detail.fieldData;
    eventsLimit = fieldData.eventsLimit;
    includeFollowers = (fieldData.includeFollowers === "yes");
    includeRedemptions = (fieldData.includeRedemptions === "yes");
    includeHosts = (fieldData.includeHosts === "yes");
    minHost = fieldData.minHost;
    includeRaids = (fieldData.includeRaids === "yes");
    minRaid = fieldData.minRaid;
    includeSubs = (fieldData.includeSubs === "yes");
    includeTips = (fieldData.includeTips === "yes");
    minTip = fieldData.minTip;
    includeCheers = (fieldData.includeCheers === "yes");
    minCheer = fieldData.minCheer;
    direction = fieldData.direction;
    userLocale = fieldData.locale;
    textOrder = fieldData.textOrder;
    fadeoutTime = fieldData.fadeoutTime;

    let eventIndex;
    for (eventIndex = 0; eventIndex < recents.length; eventIndex++) {
        const event = recents[eventIndex];

        if (event.type === 'follower') {
            if (includeFollowers) {
                addEvent('follower', 'Follower', event.name);
            }
        } else if (event.type === 'redemption') {
            if (includeRedemptions) {
                addEvent('redemption', 'Redeemed', event.name);
            }
        } else if (event.type === 'subscriber') {
            if (!includeSubs) continue;
            if (event.amount === 'gift') {
                addEvent('sub', `Sub gift`, event.name);
            } else {
                addEvent('sub', `Sub X${event.amount}`, event.name);
            }

        } else if (event.type === 'host') {
            if (includeHosts && minHost <= event.amount) {
                addEvent('host', `Host ${event.amount.toLocaleString()}`, event.name);
            }
        } else if (event.type === 'cheer') {
            if (includeCheers && minCheer <= event.amount) {
                addEvent('cheer', `${event.amount.toLocaleString()} Bits`, event.name);
            }
        } else if (event.type === 'tip') {
            if (includeTips && minTip <= event.amount) {
                if (event.amount === parseInt(event.amount)) {
                    addEvent('tip', event.amount.toLocaleString(userLocale, {
                        style: 'currency',
                        minimumFractionDigits: 0,
                        currency: userCurrency.code
                    }), event.name);
                } else {
                    addEvent('tip', event.amount.toLocaleString(userLocale, {
                        style: 'currency',
                        currency: userCurrency.code
                    }), event.name);
                }
            }
        } else if (event.type === 'raid') {
            if (includeRaids && minRaid <= event.amount) {
                addEvent('raid', `Raid ${event.amount.toLocaleString()}`, event.name);
            }
        }
    }
});

function getActionType({detail: {event}}: TwitchEvent) {
    const type: TwitchActionType = TwitchActionType[event?.type as TwitchActionType]

    switch (type) {
        case TwitchActionType.follower:
            const username = event.data?.username
            addEvent(type, 'Follower', username);
            break
        case TwitchActionType.subscriber:
            if (event.data?.gifted) {
                addEvent(type, `Sub gift`, event.name);
            } else {
                addEvent(type, `Sub X${event.data.amount}`, event.name);
            }
            break
        case TwitchActionType.tip:
            if (event.data.amount && minCheer <= event.data.amount) {
                addEvent('cheer', `${event.data?.amount.toLocaleString()} Bits`, event.name);
            }
            break
        case TwitchActionType.cheer:
            if (event.data.amount) {
                addEvent('cheer', `${event.data.amount.toLocaleString()} Bits`, event.name);
            }
            break
        case TwitchActionType.raid:
            if (event.data.amount) {
                addEvent('raid', `Raid ${event.data.amount.toLocaleString()}`, event.data.username);
            }
            break
        case TwitchActionType.redemption:
            addEvent('redemption', 'Redeemed', event.name);
            break
        // case TwitchActionType.merch:
        //     addEvent(type, 'Follower', username);
        //     break
        case TwitchActionType.charityCampaignDonation:
            if (event.data.amount && minDonate <= event.data.amount) {
                addEvent('tip', event.data.amount.toLocaleString(userLocale, {
                    style: 'currency',
                    minimumFractionDigits: 0,
                    currency: userCurrency.code
                }), event.name);

                addEvent('tip', event.data.amount.toLocaleString(userLocale, {
                    style: 'currency',
                    currency: userCurrency.code
                }), event.data.username);
            }
            break
    }
}


function addEvent(type, text, username) {
    totalEvents += 1;
    let element;
    if (textOrder === "actionFirst") {
        element = `
    <div class="event-container" id="event-${totalEvents}">
        <div class="backgroundsvg"></div>
        <div class="event-image event-${type}"></div>
        <div class="username-container">${text}</div>
       <div class="details-container">${username}</div>
    </div>`;
    } else {
        element = `
    <div class="event-container" id="event-${totalEvents}">
        <div class="backgroundsvg"></div>
        <div class="event-image event-${type}"></div>
        <div class="username-container">${username}</div>
       <div class="details-container">${text}</div>
    </div>`;
    }
    if (direction === "bottom") {
        $('.main-container').removeClass("fadeOutClass").show().append(element);
    } else {
        $('.main-container').removeClass("fadeOutClass").show().prepend(element);
    }
    if (fadeoutTime !== 999) {
        $('.main-container').addClass("fadeOutClass");
    }
    if (totalEvents > eventsLimit) {
        removeEvent(totalEvents - eventsLimit);
    }
}

function removeEvent(eventId: string) {
    $(`#event-${eventId}`).animate({
        height: 0,
        opacity: 0
    }, 'slow', function () {
        $(`#event-${eventId}`).remove();
    });
}




//======-===========
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
        }
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