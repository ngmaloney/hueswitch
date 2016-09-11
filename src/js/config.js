module.exports = [
    { 
        "type": "heading", 
        "defaultValue": "Preferences" ,
        "size": 3
    }, 
    {
        "type": "section",
        "items": [
            {
                "type": "heading",
                "defaultValue": "Connection Info"
            },
            {
                "type": "input",
                "appKey": "hub_ip",
                "label": "Hub Address/Port"
            },
            {
                "type": "input",
                "appKey": "user",
                "label": "Username",
                "defaultValue": "username"
            }
        ]
    },
    {
        "type": "submit",
        "defaultValue": "Save"
    }
];
