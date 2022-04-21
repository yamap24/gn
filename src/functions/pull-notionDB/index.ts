import {handlerPath} from '@libs/handler-resolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.main`,
    events: [
        {
            schedule: 'cron(0 10 * * WED *)'
        }
    ],
};
