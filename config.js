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
    page_size: 10,
	site_static_host: '', // 静态文件存储域名

	db: 'mongodb://localhost/code_snippet',
	auth_secret: 'memo_lois',
    session_secret: 'snippet_it',
    auth_cookie_name: 'si',
	port: 80,

	// RSS
	rss: {
	},

	// [ [ plugin_name, options ], ... ]
	plugins: [],

    combo: {
        basePath: './files/',
        alias: {
            'q': 'E:\\svn\\FE\\xm\\faxmail\\electronic-signature\\js\\qunit',
            'b': 'E:\\svn\\FE\\xm\\faxmail\\electronic-signature\\js\\base',
            'c': 'E:\\svn\\FE\\xm\\faxmail\\electronic-signature\\js\\core',
            'p': 'E:\\svn\\FE\\xm\\faxmail\\electronic-signature\\js\\pages',
            'w': 'E:\\svn\\FE\\xm\\faxmail\\electronic-signature\\js\\widget',
            'm': 'E:\\svn\\FE\\xm\\faxmail\\electronic-signature\\js\\modules'
        },
        delimiter: ',',
        compress: false
    },

    // 用户缓冲池配置
    // 效果应该有比MongoDb的索引好吧……
    userPool: {
        indexName: '_id', // 用作索引的属性名
        maxCount: 100000,
        reduceTo: 20000
    },
    // 以函数的方式获得，避免修改造成的互相影响
    getCodeTypeList: function() {
        return {
            html: 0,
            javascript: 0,
            css: 0,
            java: 0,
            'c++': 0,
            python: 0,
            ruby: 0
        };
    }
};

var host = module.exports.host;
if (host[host.length - 1] === '/') {
	moduse.exports.host = host.substring(0, host.length - 1);
}

// 冻结配置对象，防止修改
Object.freeze(module.exports);
