// This file is auto-generated by @hey-api/openapi-ts

export const $Bot = {
    properties: {
        name: {
            type: 'string',
            title: 'Name'
        },
        context: {
            anyOf: [
                {
                    type: 'object'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Context'
        },
        id: {
            type: 'string',
            format: 'uuid',
            title: 'Id'
        },
        creator_id: {
            type: 'string',
            format: 'uuid',
            title: 'Creator Id'
        },
        creator: {
            '$ref': '#/components/schemas/User'
        },
        tokens: {
            type: 'integer',
            title: 'Tokens',
            readOnly: true
        }
    },
    type: 'object',
    required: ['name', 'id', 'creator_id', 'creator', 'tokens'],
    title: 'Bot'
} as const;

export const $HTTPValidationError = {
    properties: {
        detail: {
            items: {
                '$ref': '#/components/schemas/ValidationError'
            },
            type: 'array',
            title: 'Detail'
        }
    },
    type: 'object',
    title: 'HTTPValidationError'
} as const;

export const $User = {
    properties: {
        clerk_id: {
            type: 'string',
            title: 'Clerk Id'
        },
        id: {
            type: 'string',
            format: 'uuid',
            title: 'Id'
        },
        is_active: {
            type: 'boolean',
            title: 'Is Active'
        }
    },
    type: 'object',
    required: ['clerk_id', 'id', 'is_active'],
    title: 'User'
} as const;

export const $ValidationError = {
    properties: {
        loc: {
            items: {
                anyOf: [
                    {
                        type: 'string'
                    },
                    {
                        type: 'integer'
                    }
                ]
            },
            type: 'array',
            title: 'Location'
        },
        msg: {
            type: 'string',
            title: 'Message'
        },
        type: {
            type: 'string',
            title: 'Error Type'
        }
    },
    type: 'object',
    required: ['loc', 'msg', 'type'],
    title: 'ValidationError'
} as const;