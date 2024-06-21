import { defineWidget } from "@mylinkpi/widget-core";
import React, { lazy, useEffect, useMemo, useState } from "react";
import { Form, Input, Select } from "antd";
import { AlertOutlined } from "@ant-design/icons";
import {
  useCurrentUser,
  useWidgetSetting,
  useWidgetSharedState,
  useTemplateList,
  useTempatePropList,
  usePiSDK,
  useCurrentOrgId,
} from "@mylinkpi/widget-react";
import { JsonView, allExpanded, defaultStyles } from "react-json-view-lite";

import "react-json-view-lite/dist/index.css";
// @ts-ignore
import styles from "./index.module.scss";

type BasicSDKExampleConfig = {
  templateId: string;
  propIndex?: number;
  searchValue: string;
};

const config = defineWidget<BasicSDKExampleConfig>()({
  id: "BasicSDKExample",
  title: "SDK示例",
  icon: () => {
    return <AlertOutlined />;
  },
  basic: { defaultHeight: 4, defaultWidth: 4, minHeight: 2, minWidth: 2 },
  metadata: { templateId: "", searchValue: "" },
  render: () => {
    const currentUser = useCurrentUser();
    const orgId = useCurrentOrgId();
    const piSDK = usePiSDK();

    const [setting] = useWidgetSetting<BasicSDKExampleConfig>();
    const [result, setResult] = useState({});

    useEffect(() => {
      (async () => {
        const res = await piSDK.getNodeList({
          orgId,
          pageSize: 20,
          page: 1,
          condition: [
            { key: "templateId", op: "intersect", input: [setting.templateId] },
            {
              key: "prop",
              index: setting.propIndex,
              op: "textInclude",
              input: setting.searchValue,
              extends: {
                type: "text",
              },
            },
          ],
        });
        console.log("query result: ", res);
        setResult(res);
      })();
    }, []);

    return (
      <div className={styles.content}>
        <h1></h1>
        <h4>{currentUser.name || "老王"}</h4>
        <div className={styles.json}>
          <JsonView
            data={result}
            shouldExpandNode={allExpanded}
            style={defaultStyles}
          />
        </div>
      </div>
    );
  },
  setting: () => {
    const [form] = Form.useForm();
    const [setting, setSetting] = useWidgetSetting<BasicSDKExampleConfig>();
    const tempList = useTemplateList();
    const tempSelectOptions = useMemo(
      () =>
        tempList
          .filter((i) => i.status === 0)
          .map((i) => ({
            label: i.name,
            value: i.template_id,
          })),
      [tempList],
    );
    const templateId = Form.useWatch(["templateId"], form);
    const propList = useTempatePropList(templateId || "");
    const propSelectOptions = useMemo(
      () => propList.map((p) => ({ value: p.propIndex, label: p.name })),
      [propList],
    );

    return (
      <Form
        form={form}
        layout="horizontal"
        initialValues={setting}
        onValuesChange={(_, values) => {
          setSetting(values);
        }}
      >
        <Form.Item label="主题类型" name="templateId">
          <Select options={tempSelectOptions} />
        </Form.Item>
        <Form.Item label="属性" name="propIndex">
          <Select options={propSelectOptions} />
        </Form.Item>
        <Form.Item label="搜索值" name="searchValue">
          <Input />
        </Form.Item>
      </Form>
    );
  },
  preview: () => {
    const [setting] = useWidgetSetting<BasicSDKExampleConfig>();
    return (
      <div className={styles.content}>
        <h1>SDK示例</h1>
        preview
      </div>
    );
  },
});

export default config;
