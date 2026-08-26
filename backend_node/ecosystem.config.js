//ecosystem.config.ts
module.exports={
    apps:[
        {
            name:"node_prod_app",
            //script:"./src/index.ts",
            script:"/opt/20260803_react_django_nodejs/backend_node/server.js",
            // interpreter_args:"-r ts-node/register",

            exec_mode:"cluster",
            instances:2,
            // cwd: "/opt/myapp/current",

            env:{
                NODE_ENV:"production",
                PORT:8001,
                // DATABASE_URL:"postgresql://user1:password@localhost:5432/nodedb1",
                // REDIS_URL:"redis://127.0.0.1:6379",
            },
            env_production: {
                NODE_ENV: 'production',
            },
            autorestart:true,
            // watch:true,
            max_memory_restart:"500M",
            // error_file: '/var/log/20260803_react_django_nodejs/node_pm2_error.log',
            // out_file: '/var/log/20260803_react_django_nodejs/node_pm2_out.log',
            error_file: '/home/hf/test/web_deployment/20260803_react_django_nodejs/backend_node/node_pm2_error.log',
            out_file: '/home/hf/test/web_deployment/20260803_react_django_nodejs/backend_node/node_pm2_out.log',
            merge_logs: true,   //set true in cluster mode
            log_date_format: "YYYY-MM-DD HH:mm:ss Z",
        },
    ],
};