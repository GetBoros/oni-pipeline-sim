//------------------------------------------------------------------------------------------------------------
class ANetwork_Manager
{// Network subsystem for HTTP and backend API communication. Emulates UGameInstanceSubsystem.

    constructor(base_url)
    {
        this.Base_Url = base_url;
        this.Auth_Token = localStorage.getItem("session_token") || null;
    }
}
//------------------------------------------------------------------------------------------------------------




// ANetwork_Manager
ANetwork_Manager.prototype.Request_Login = async function (user_name, user_password)
{
    let endpoint_url = "";
    let payload = null;
    let request_options = null;
    let response = null;
    let data = null;
    let is_success = false;

    // 1.0. Prepare network payload and target endpoint
    endpoint_url = this.Base_Url + "/login";
    payload = {
        name: user_name,
        password: user_password
    };

    request_options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    };

    // 2.0. Execute asynchronous HTTP request
    try
    {
        response = await fetch(endpoint_url, request_options);

        // 2.1. Verify HTTP response status
        if (response.ok === false)
        {
            console.log(
                "%c[SERVER ERROR]%c HTTP Status: " + response.status,
                "background: #f39c12; color: #000000; font-weight: bold; padding: 3px 7px; border-radius: 3px;",
                "color: #f39c12; font-weight: bold; margin-left: 8px;"
            );
            return false;
        }

        // 2.2. Parse JSON response body
        data = await response.json();

        // 2.3. Process authorization token
        if ((data.status === "success") && (data.token !== undefined))
        {
            this.Auth_Token = data.token;
            localStorage.setItem("session_token", data.token);

            console.log(
                "%c[SERVER ONLINE]%c Logged in successfully! Token: " + data.token,
                "background: #2ecc71; color: #000000; font-weight: bold; padding: 3px 7px; border-radius: 3px;",
                "color: #2ecc71; font-weight: bold; margin-left: 8px;"
            );

            is_success = true;
        }
    }
    catch (error)
    {
        // 2.4. Handle network unreachable exception
        console.log(
            "%c[SERVER OFFLINE]%c C++ Backend is down or unreachable.",
            "background: #e74c3c; color: #ffffff; font-weight: bold; padding: 3px 7px; border-radius: 3px;",
            "color: #e74c3c; font-weight: bold; margin-left: 8px;"
        );
        is_success = false;
    }

    return is_success;
};
//------------------------------------------------------------------------------------------------------------
ANetwork_Manager.prototype.Get_Token = function ()
{
    return this.Auth_Token;
};
//------------------------------------------------------------------------------------------------------------
ANetwork_Manager.prototype.Is_Authenticated = function ()
{
    return this.Auth_Token !== null;
};
//------------------------------------------------------------------------------------------------------------




//------------------------------------------------------------------------------------------------------------
export default ANetwork_Manager;
//------------------------------------------------------------------------------------------------------------