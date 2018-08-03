module.exports = {
	"env": {
		"browser": true,
		"commonjs": true
	},
	"extends": "eslint:recommended",
	"rules": {
		// "indent": [
		// 	"error",
		// 	2
		// ],
		"linebreak-style": [
			"error",
			"windows"
		],
		"quotes": [
			"error",
			"single"
		],
		"semi": [
			"error",
			"always"
		],
		"no-path-concat": "off",
		"no-undef": "off", //
		"no-console": "off", // 允许使用conosle
		"no-unused-vars": "off", //
		// "no-empty": "off" // 允许花括号内为空
	}
};