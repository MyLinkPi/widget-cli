import { readFileSync } from "node:fs";
import path from "node:path";

import { Command, Flags } from "@oclif/core";
import { consola } from "consola";
import { build } from "vite";

import {
  addWidget,
  getWidget,
  updateWidget,
  uploadScript,
} from "../services/index.js";
import { getWidgetConfig } from "../utils/index.js";
import { loginLinkPi } from "../utils/login.js";
import { createViteBuildConfig } from "../utils/vite.js";

export default class Publish extends Command {
  static description = "Build and publish your widget";

  static examples = [`$ widget-cli publish`];

  static flags = {
    help: Flags.help({ char: "h" }),
    // 可以添加更多的flag，如指定输出目录等
  };

  async buildAndUpload() {
    try {
      const widgetConfig = await getWidgetConfig();
      // 使用Vite打包
      await build(
        createViteBuildConfig({
          widgetId: widgetConfig.id,
          widgetTitle: widgetConfig.name,
        })
      );

      // 调用上传API
      // 示例使用axios上传（需先安装axios）
      const filePath = path.join(process.cwd(), "dist/index.js");
      const fileContent = readFileSync(filePath, "utf8");

      const res = await uploadScript(fileContent);
      const scriptId = res.data.id;

      consola.info("scriptId", scriptId);

      const info = await getWidget(widgetConfig.id);
      if (info) {
        consola.info("updating widget");
        await updateWidget({
          name: widgetConfig.name,
          script_id: scriptId,
          widget_id: widgetConfig.id,
        });
      } else {
        consola.info("adding widget");
        await addWidget({
          name: widgetConfig.name,
          script_id: scriptId,
          widget_id: widgetConfig.id,
        });
      }

      consola.info("Widget published successfully.");
    } catch (error) {
      consola.error(`Error publishing widget: ${error}`);
    }
  }

  async run() {
    const isLoginSuccess = await loginLinkPi();
    if (!isLoginSuccess) {
      consola.error("Login failed...");
      this.exit(1);
    }
    consola.start("Building and publishing the widget...");
    await this.buildAndUpload();
  }
}
