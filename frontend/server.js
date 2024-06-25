// Author: Mario Guriuc

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const webRoutes = {
    '': 'html/home.html',
    'login': 'html/login.html',
    'register': 'html/register.html',
    'add-center': 'html/add_center.html',
    'add-inmate': 'html/add_inmate_admin.html',//Vlad
    'centers': 'html/detention_centers.html',
    'forgot-password': 'html/forgot_password.html',
    'statistics': 'html/generate_stats.html',//Vlad
};

const dynamicWebRoutes = {
    'account/{username}': 'html/account.html',
    'account/{username}/edit-account': 'html/edit_account.html',
    'account/{username}/delete-account': 'html/delete_account.html',
    'account/{username}/admin-page': 'html/admin_page.html',
    'account/{username}/change-password': 'html/change_password.html',
    'account/{username}/change-role': 'html/change_role.html',
    'centers/{page_number}': 'html/detention_centers.html',
    'centers/{center_id}/edit': 'html/edit_center.html',//Vlad
    'centers/{center_id}/inmates': 'html/inmates.html',//Vlad
    'centers/{center_id}/inmates/{inmate_id}': 'html/inmates.html',//Vlad
    'centers/{center_id}/add-inmate': 'html/add_inmate.html',//Vlad
    'account/{username}/visits': 'html/visits.html',//Vlad
    'centers/{center_id}/inmates/{inmate_id}/add-visit': 'html/add_visit.html',//Vlad
    'account/{username}/visits/{visit_id}': 'html/edit_visit.html',//Vlad
    'centers/{center_id}/inmates/{inmate_id}/transfer': 'html/transfer_inmate.html',//Vlad
    'centers/{center_id}/inmates/{inmate_id}/edit': 'html/edit_inmate.html',//Vlad
};

function matchRoute(route, routes) {
    for (const pattern in routes) {
        const regexPattern = new RegExp('^' + pattern.replace(/\{[a-zA-Z0-9_]+}/g, '([^/]+)') + '$');
        if (regexPattern.test(route)) {
            return routes[pattern];
        }
    }
    return null;
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    const route = parsedUrl.pathname.slice(1);

    let fileToInclude = matchRoute(route, dynamicWebRoutes);

    if (!fileToInclude && webRoutes.hasOwnProperty(route)) {
        fileToInclude = webRoutes[route];
    }

    if (!fileToInclude) {
        const extname = path.extname(parsedUrl.pathname);
        const validExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg'];

        if (validExtensions.includes(extname)) {
            const staticFilePath = path.join(__dirname, 'frontend', parsedUrl.pathname);
            fs.readFile(staticFilePath, (err, data) => {
                if (err) {
                    res.statusCode = 404;
                    res.end('Not Found');
                }
                else {
                    res.setHeader('Content-Type', getMimeType(extname));
                    res.end(data);
                }
            });
            return;
        }
        else {
            res.statusCode = 404;
            fileToInclude = 'html/404.html';
        }
    }

    const filePath = path.join(__dirname, 'frontend', fileToInclude);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.statusCode = 500;
            res.end('Internal Server Error');
            return;
        }
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
    });
});

function getMimeType(ext) {
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
    };
    return mimeTypes[ext] || 'application/octet-stream';
}


const PORT = 8000;
server.listen(PORT);
