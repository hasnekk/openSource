const cityAllProperties = ["name", "country", "region", "population", "language", "currency", "timezone", "area"];

const cityRequiredProperties = ["name", "country", "language", "currency", "timezone"];

const transitProperties = ["departureCity", "destination", "distance", "duration", "price"];

function checkIfCity(city) {

    let keys = Object.keys(city);

    if (!(keys.length >= 5 && keys.length <= 8)) {
        return false;
    }

    for (let key of keys) {
        if (!cityAllProperties.includes(key)) {
            return false;
        }
    }

    for (let requiredProperty of cityRequiredProperties) {
        if (!keys.includes(requiredProperty)) {
            return false;
        }
    }

    return true;
}

function checkIfTransitRoute(transitRoute) {
    let keys = Object.keys(transitRoute);

    if (keys.length != 5) {
        return false;
    }

    for (let requiredProperty of transitProperties) {
        if (!keys.includes(requiredProperty)) {
            return false;
        }
    }

    return true;
}

export { checkIfCity, checkIfTransitRoute };