function isNotDefined(value) {
    return value === null || value === undefined
}

function isDefined(value) {
    return !isNotDefined(value)
}

function safeString(value) {
    if (isNotDefined(value)) {
        return ''
    }

    if (typeof value === 'number') {
        return isNaN(value) ? '' : value.toString()
    }

    return typeof value === 'string' ? value : ''
}

class AcceptsEverythingAsserter {
    whenDefined() {
        return this
    }

    matches() {
        return this
    }

    isDefined() {
        return this
    }
}

class Asserter {
    constructor(value) {
        this.value = value
    }

    whenDefined() {
        if (isDefined(this.value)) {
            return this
        }

        return new AcceptsEverythingAsserter()
    }

    equalTo(value, reason = "Values do not match") {
        if (this.value !== value) {
            throw new Error(reason)
        }
    }

    matches(matcher, reason = "The value is not correct") {
        if (typeof matcher.exec === 'function') {
            if (matcher.exec(this.value) === null) {
                throw new Error(reason)
            }
        } else {
            throw new Error("Expected exec function in matcher")
        }
        return this
    }

    isDefined(reason = "The value must be defined") {
        if (isNotDefined(this.value)) {
            throw new Error(reason)
        }
        return this
    }
}

function assertThat(value) {
    return new Asserter(value)
}


export {
    isNotDefined,
    isDefined,
    safeString,
    assertThat
}
