import "node:module";
import { defineConfig } from "rolldown";
import { version } from "@misskey-dev/summaly";
import { execa, execaNode } from "execa";
import esmShim from "@rollup/plugin-esm-shim";
/**
* Watchモード時にバックエンドの起動・停止制御を行うプラグイン
*/
function backendDevServerPlugin() {
	let backendProcess = null;
	async function runBuildAssets() {
		await execa("pnpm", ["run", "build-assets"], {
			cwd: "../../",
			stdout: process.stdout,
			stderr: process.stderr
		});
	}
	async function killBackendProcess() {
		if (backendProcess) {
			backendProcess.catch(() => {});
			backendProcess.kill();
			await new Promise((resolve) => backendProcess.on("exit", resolve));
			backendProcess = null;
		}
	}
	return {
		name: "backend-dev-server",
		async closeBundle() {
			await runBuildAssets();
			if (backendProcess) await killBackendProcess();
			backendProcess = execaNode("./built/entry.js", [], {
				stdout: process.stdout,
				stderr: process.stderr,
				env: { NODE_ENV: "development" }
			});
		},
		async watchChange() {
			if (backendProcess) {
				await killBackendProcess();
				await runBuildAssets();
			}
		}
	};
}
var rolldown_config_default = defineConfig((args) => {
	const isWatchMode = args.watch != null && args.watch !== "false";
	const isE2E = args.e2e != null && args.e2e !== "false";
	const externalModules = [
		/^slacc-.*/,
		"class-transformer",
		"class-validator",
		/^@sentry\/.*/,
		/^@sentry-internal\/.*/,
		"@nestjs/websockets/socket-module",
		"@nestjs/microservices/microservices-module",
		"@nestjs/microservices",
		/^@napi-rs\/.*/,
		"mock-aws-s3",
		"aws-sdk",
		"nock",
		"sharp",
		"jsdom",
		"re2",
		"ipaddr.js",
		"file-type"
	];
	const define = { "_SUMMALY_VERSION_": JSON.stringify(version) };
	if (isE2E) return {
		input: "./test-server/entry.ts",
		platform: "node",
		tsconfig: "./test-server/tsconfig.json",
		plugins: [esmShim()],
		transform: { define },
		output: {
			keepNames: true,
			sourcemap: true,
			dir: "./built-test",
			cleanDir: true,
			format: "esm"
		},
		external: externalModules
	};
	else return {
		input: [
			"./src/boot/entry.ts",
			"./src/boot/cli.ts",
			"./src/config.ts",
			"./src/postgres.ts",
			"./src/server/api/openapi/gen-spec.ts"
		],
		platform: "node",
		tsconfig: true,
		plugins: [esmShim(), isWatchMode ? backendDevServerPlugin() : void 0],
		transform: { define },
		output: {
			keepNames: true,
			minify: !isWatchMode,
			sourcemap: isWatchMode,
			dir: "./built",
			cleanDir: !isWatchMode,
			format: "esm"
		},
		watch: {
			include: ["src/**/*.{ts,js,mjs,cjs,tsx,json}"],
			clearScreen: false
		},
		external: isWatchMode ? /^(?!@\/)[^.\/](?!:[\/\\])/ : externalModules
	};
});
//#endregion
export { rolldown_config_default as default };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9sbGRvd24uY29uZmlnLkNyTVJySEtILmpzIiwibmFtZXMiOlsic3VtbWFseVZlcnNpb24iXSwic291cmNlcyI6WyJyb2xsZG93bi5jb25maWcudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAncm9sbGRvd24nO1xuaW1wb3J0IHsgdmVyc2lvbiBhcyBzdW1tYWx5VmVyc2lvbiB9IGZyb20gJ0BtaXNza2V5LWRldi9zdW1tYWx5JztcbmltcG9ydCB0eXBlIHsgUGx1Z2luLCBFeHRlcm5hbE9wdGlvbiB9IGZyb20gJ3JvbGxkb3duJztcbmltcG9ydCB7IGV4ZWNhLCBleGVjYU5vZGUgfSBmcm9tICdleGVjYSc7XG5pbXBvcnQgdHlwZSB7IFJlc3VsdFByb21pc2UgfSBmcm9tICdleGVjYSc7XG5pbXBvcnQgZXNtU2hpbSBmcm9tICdAcm9sbHVwL3BsdWdpbi1lc20tc2hpbSc7XG5cbi8qKlxuICogV2F0Y2jjg6Ljg7zjg4nmmYLjgavjg5Djg4Pjgq/jgqjjg7Pjg4njga7otbfli5Xjg7vlgZzmraLliLblvqHjgpLooYzjgYbjg5fjg6njgrDjgqTjg7NcbiAqL1xuZnVuY3Rpb24gYmFja2VuZERldlNlcnZlclBsdWdpbigpOiBQbHVnaW4ge1xuXHRsZXQgYmFja2VuZFByb2Nlc3M6IFJlc3VsdFByb21pc2UgfCBudWxsID0gbnVsbDtcblxuXHRhc3luYyBmdW5jdGlvbiBydW5CdWlsZEFzc2V0cygpIHtcblx0XHRhd2FpdCBleGVjYSgncG5wbScsIFsncnVuJywgJ2J1aWxkLWFzc2V0cyddLCB7XG5cdFx0XHRjd2Q6ICcuLi8uLi8nLFxuXHRcdFx0c3Rkb3V0OiBwcm9jZXNzLnN0ZG91dCxcblx0XHRcdHN0ZGVycjogcHJvY2Vzcy5zdGRlcnIsXG5cdFx0fSk7XG5cdH1cblxuXHRhc3luYyBmdW5jdGlvbiBraWxsQmFja2VuZFByb2Nlc3MoKSB7XG5cdFx0aWYgKGJhY2tlbmRQcm9jZXNzKSB7XG5cdFx0XHRiYWNrZW5kUHJvY2Vzcy5jYXRjaCgoKSA9PiB7fSk7IC8vIGJhY2tlbmRQcm9jZXNzLmtpbGwoKeOBq+OCiOOBo+OBpueZuueUn+OBmeOCi+S+i+WkluOCkueEoeimluOBmeOCi+OBn+OCgeOBq2NhdGNoKCnjgpLlkbzjgbPlh7rjgZlcblx0XHRcdGJhY2tlbmRQcm9jZXNzLmtpbGwoKTtcblx0XHRcdGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gYmFja2VuZFByb2Nlc3MhLm9uKCdleGl0JywgcmVzb2x2ZSkpO1xuXHRcdFx0YmFja2VuZFByb2Nlc3MgPSBudWxsO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiB7XG5cdFx0bmFtZTogJ2JhY2tlbmQtZGV2LXNlcnZlcicsXG5cdFx0YXN5bmMgY2xvc2VCdW5kbGUoKSB7XG5cdFx0XHRhd2FpdCBydW5CdWlsZEFzc2V0cygpO1xuXHRcdFx0aWYgKGJhY2tlbmRQcm9jZXNzKSB7XG5cdFx0XHRcdGF3YWl0IGtpbGxCYWNrZW5kUHJvY2VzcygpO1xuXHRcdFx0fVxuXHRcdFx0YmFja2VuZFByb2Nlc3MgPSBleGVjYU5vZGUoJy4vYnVpbHQvZW50cnkuanMnLCBbXSwge1xuXHRcdFx0XHRzdGRvdXQ6IHByb2Nlc3Muc3Rkb3V0LFxuXHRcdFx0XHRzdGRlcnI6IHByb2Nlc3Muc3RkZXJyLFxuXHRcdFx0XHRlbnY6IHtcblx0XHRcdFx0XHROT0RFX0VOVjogJ2RldmVsb3BtZW50Jyxcblx0XHRcdFx0fSxcblx0XHRcdH0pO1xuXHRcdH0sXG5cdFx0YXN5bmMgd2F0Y2hDaGFuZ2UoKSB7XG5cdFx0XHRpZiAoYmFja2VuZFByb2Nlc3MpIHtcblx0XHRcdFx0YXdhaXQga2lsbEJhY2tlbmRQcm9jZXNzKCk7XG5cdFx0XHRcdGF3YWl0IHJ1bkJ1aWxkQXNzZXRzKCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKChhcmdzKSA9PiB7XG5cdGNvbnN0IGlzV2F0Y2hNb2RlID0gYXJncy53YXRjaCAhPSBudWxsICYmIGFyZ3Mud2F0Y2ggIT09ICdmYWxzZSc7XG5cdGNvbnN0IGlzRTJFID0gYXJncy5lMmUgIT0gbnVsbCAmJiBhcmdzLmUyZSAhPT0gJ2ZhbHNlJztcblxuXHQvLyDpgJrluLjjga7jg5Pjg6vjg4nmmYLjgatleHRlcm5hbOOBqOOBmeOCi+ODouOCuOODpeODvOODq1xuXHRjb25zdCBleHRlcm5hbE1vZHVsZXM6IEV4dGVybmFsT3B0aW9uID0gW1xuXHRcdC9ec2xhY2MtLiovLFxuXHRcdCdjbGFzcy10cmFuc2Zvcm1lcicsXG5cdFx0J2NsYXNzLXZhbGlkYXRvcicsXG5cdFx0L15Ac2VudHJ5XFwvLiovLFxuXHRcdC9eQHNlbnRyeS1pbnRlcm5hbFxcLy4qLyxcblx0XHQnQG5lc3Rqcy93ZWJzb2NrZXRzL3NvY2tldC1tb2R1bGUnLFxuXHRcdCdAbmVzdGpzL21pY3Jvc2VydmljZXMvbWljcm9zZXJ2aWNlcy1tb2R1bGUnLFxuXHRcdCdAbmVzdGpzL21pY3Jvc2VydmljZXMnLFxuXHRcdC9eQG5hcGktcnNcXC8uKi8sXG5cdFx0J21vY2stYXdzLXMzJyxcblx0XHQnYXdzLXNkaycsXG5cdFx0J25vY2snLFxuXHRcdCdzaGFycCcsXG5cdFx0J2pzZG9tJyxcblx0XHQncmUyJyxcblx0XHQnaXBhZGRyLmpzJyxcblx0XHQnZmlsZS10eXBlJyxcblx0XTtcblxuXHRjb25zdCBkZWZpbmU6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG5cdFx0Ly8gU3VtbWFseeOBruODkOODvOOCuOODp+ODs+OCkuWfi+OCgei+vOOCgFxuXHRcdCdfU1VNTUFMWV9WRVJTSU9OXyc6IEpTT04uc3RyaW5naWZ5KHN1bW1hbHlWZXJzaW9uKSxcblx0fTtcblxuXHRpZiAoaXNFMkUpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0aW5wdXQ6ICcuL3Rlc3Qtc2VydmVyL2VudHJ5LnRzJyxcblx0XHRcdHBsYXRmb3JtOiAnbm9kZScsXG5cdFx0XHR0c2NvbmZpZzogJy4vdGVzdC1zZXJ2ZXIvdHNjb25maWcuanNvbicsXG5cdFx0XHRwbHVnaW5zOiBbXG5cdFx0XHRcdGVzbVNoaW0oKSxcblx0XHRcdF0sXG5cdFx0XHR0cmFuc2Zvcm06IHtcblx0XHRcdFx0ZGVmaW5lLFxuXHRcdFx0fSxcblx0XHRcdG91dHB1dDoge1xuXHRcdFx0XHRrZWVwTmFtZXM6IHRydWUsXG5cdFx0XHRcdHNvdXJjZW1hcDogdHJ1ZSxcblx0XHRcdFx0ZGlyOiAnLi9idWlsdC10ZXN0Jyxcblx0XHRcdFx0Y2xlYW5EaXI6IHRydWUsXG5cdFx0XHRcdGZvcm1hdDogJ2VzbScsXG5cdFx0XHR9LFxuXHRcdFx0ZXh0ZXJuYWw6IGV4dGVybmFsTW9kdWxlcyxcblx0XHR9O1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiB7XG5cdFx0XHRpbnB1dDogW1xuXHRcdFx0XHQnLi9zcmMvYm9vdC9lbnRyeS50cycsXG5cdFx0XHRcdCcuL3NyYy9ib290L2NsaS50cycsXG5cdFx0XHRcdCcuL3NyYy9jb25maWcudHMnLFxuXHRcdFx0XHQnLi9zcmMvcG9zdGdyZXMudHMnLFxuXHRcdFx0XHQnLi9zcmMvc2VydmVyL2FwaS9vcGVuYXBpL2dlbi1zcGVjLnRzJyxcblx0XHRcdF0sXG5cdFx0XHRwbGF0Zm9ybTogJ25vZGUnLFxuXHRcdFx0dHNjb25maWc6IHRydWUsXG5cdFx0XHRwbHVnaW5zOiBbXG5cdFx0XHRcdGVzbVNoaW0oKSxcblx0XHRcdFx0KGlzV2F0Y2hNb2RlID8gYmFja2VuZERldlNlcnZlclBsdWdpbigpIDogdW5kZWZpbmVkKSxcblx0XHRcdF0sXG5cdFx0XHR0cmFuc2Zvcm06IHtcblx0XHRcdFx0ZGVmaW5lLFxuXHRcdFx0fSxcblx0XHRcdG91dHB1dDoge1xuXHRcdFx0XHRrZWVwTmFtZXM6IHRydWUsXG5cdFx0XHRcdG1pbmlmeTogIWlzV2F0Y2hNb2RlLFxuXHRcdFx0XHRzb3VyY2VtYXA6IGlzV2F0Y2hNb2RlLFxuXHRcdFx0XHRkaXI6ICcuL2J1aWx0Jyxcblx0XHRcdFx0Y2xlYW5EaXI6ICFpc1dhdGNoTW9kZSxcblx0XHRcdFx0Zm9ybWF0OiAnZXNtJyxcblx0XHRcdH0sXG5cdFx0XHR3YXRjaDoge1xuXHRcdFx0XHRpbmNsdWRlOiBbJ3NyYy8qKi8qLnt0cyxqcyxtanMsY2pzLHRzeCxqc29ufSddLFxuXHRcdFx0XHRjbGVhclNjcmVlbjogZmFsc2UsXG5cdFx0XHR9LFxuXHRcdFx0Ly8g44OT44Or44OJ44Gu6auY6YCf5YyW44Gu44Gf44KB44Gr44CBd2F0Y2jjg6Ljg7zjg4njga7jgajjgY3jga/lpJbpg6jjg6Ljgrjjg6Xjg7zjg6vjga/lhajjgabjg5Djg7Pjg4njg6vjgZfjgarjgYTjgojjgYbjgavjgZnjgotcblx0XHRcdGV4dGVybmFsOiBpc1dhdGNoTW9kZSA/IC9eKD8hQFxcLylbXi5cXC9dKD8hOltcXC9cXFxcXSkvIDogZXh0ZXJuYWxNb2R1bGVzLFxuXHRcdH07XG5cdH1cbn0pO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQVVBLFNBQVMseUJBQWlDO0NBQ3pDLElBQUksaUJBQXVDO0NBRTNDLGVBQWUsaUJBQWlCO0VBQy9CLE1BQU0sTUFBTSxRQUFRLENBQUMsT0FBTyxjQUFjLEdBQUc7R0FDNUMsS0FBSztHQUNMLFFBQVEsUUFBUTtHQUNoQixRQUFRLFFBQVE7RUFDakIsQ0FBQztDQUNGO0NBRUEsZUFBZSxxQkFBcUI7RUFDbkMsSUFBSSxnQkFBZ0I7R0FDbkIsZUFBZSxZQUFZLENBQUMsQ0FBQztHQUM3QixlQUFlLEtBQUs7R0FDcEIsTUFBTSxJQUFJLFNBQVEsWUFBVyxlQUFnQixHQUFHLFFBQVEsT0FBTyxDQUFDO0dBQ2hFLGlCQUFpQjtFQUNsQjtDQUNEO0NBRUEsT0FBTztFQUNOLE1BQU07RUFDTixNQUFNLGNBQWM7R0FDbkIsTUFBTSxlQUFlO0dBQ3JCLElBQUksZ0JBQ0gsTUFBTSxtQkFBbUI7R0FFMUIsaUJBQWlCLFVBQVUsb0JBQW9CLENBQUMsR0FBRztJQUNsRCxRQUFRLFFBQVE7SUFDaEIsUUFBUSxRQUFRO0lBQ2hCLEtBQUssRUFDSixVQUFVLGNBQ1g7R0FDRCxDQUFDO0VBQ0Y7RUFDQSxNQUFNLGNBQWM7R0FDbkIsSUFBSSxnQkFBZ0I7SUFDbkIsTUFBTSxtQkFBbUI7SUFDekIsTUFBTSxlQUFlO0dBQ3RCO0VBQ0Q7Q0FDRDtBQUNEO0FBRUEsSUFBQSwwQkFBZSxjQUFjLFNBQVM7Q0FDckMsTUFBTSxjQUFjLEtBQUssU0FBUyxRQUFRLEtBQUssVUFBVTtDQUN6RCxNQUFNLFFBQVEsS0FBSyxPQUFPLFFBQVEsS0FBSyxRQUFRO0NBRy9DLE1BQU0sa0JBQWtDO0VBQ3ZDO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7Q0FDRDtDQUVBLE1BQU0sU0FBaUMsRUFFdEMscUJBQXFCLEtBQUssVUFBVUEsT0FBYyxFQUNuRDtDQUVBLElBQUksT0FDSCxPQUFPO0VBQ04sT0FBTztFQUNQLFVBQVU7RUFDVixVQUFVO0VBQ1YsU0FBUyxDQUNSLFFBQVEsQ0FDVDtFQUNBLFdBQVcsRUFDVixPQUNEO0VBQ0EsUUFBUTtHQUNQLFdBQVc7R0FDWCxXQUFXO0dBQ1gsS0FBSztHQUNMLFVBQVU7R0FDVixRQUFRO0VBQ1Q7RUFDQSxVQUFVO0NBQ1g7TUFFQSxPQUFPO0VBQ04sT0FBTztHQUNOO0dBQ0E7R0FDQTtHQUNBO0dBQ0E7RUFDRDtFQUNBLFVBQVU7RUFDVixVQUFVO0VBQ1YsU0FBUyxDQUNSLFFBQVEsR0FDUCxjQUFjLHVCQUF1QixJQUFJLE1BQzNDO0VBQ0EsV0FBVyxFQUNWLE9BQ0Q7RUFDQSxRQUFRO0dBQ1AsV0FBVztHQUNYLFFBQVEsQ0FBQztHQUNULFdBQVc7R0FDWCxLQUFLO0dBQ0wsVUFBVSxDQUFDO0dBQ1gsUUFBUTtFQUNUO0VBQ0EsT0FBTztHQUNOLFNBQVMsQ0FBQyxtQ0FBbUM7R0FDN0MsYUFBYTtFQUNkO0VBRUEsVUFBVSxjQUFjLDhCQUE4QjtDQUN2RDtBQUVGLENBQUMifQ==