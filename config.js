module.exports = {
	name: 'Code Snippets',
    author: 'Memo Zhou',
	description: '',
	version: '0.0.1',

	// site settings
	site_headers: [
		'<meta name="author" content="Memo Zhou" />',
	],
	host: 'http://localhost',
	site_logo: '', // default is `name`
	site_navs: [
		// [ path, title, [target=''] ]
		[ '/about', '关于' ],
	],
	site_static_host: '', // 静态文件存储域名

	db: 'mongodb://localhost/code_snippet',
	session_secret: 'memo_lois',
	auth_cookie_name: 'snippet_it',
	port: 80,

	// RSS
	rss: {
	},

	// [ [ plugin_name, options ], ... ]
	plugins: []
};

var host = module.exports.host;
if (host[host.length - 1] === '/') {
	moduse.exports.host = host.substring(0, host.length - 1);
}

// 冻结配置对象，防止修改
Object.freeze(module.exports);