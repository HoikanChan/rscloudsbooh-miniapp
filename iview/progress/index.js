Component({
    externalClasses: ['i-class'],

    properties: {
        title: {
            type: String,
            value: ''
        },
        total: {
            type: Number,
            value: 0
        },
        now: {
            type: Number,
            value: 0
        },
        // normal || active || wrong || success
        status: {
            type: String,
            value: 'normal'
        },
        strokeWidth: {
            type: Number,
            value: 5
        },
        hideInfo: {
            type: Boolean,
            value: false
        }
    }
});
