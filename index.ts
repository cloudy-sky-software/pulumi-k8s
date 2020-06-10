import * as k8s from "@pulumi/kubernetes";

const namespace = "apps";
const appLabels = { app: "nginx" };

const appNs = new k8s.core.v1.Namespace("apps-ns", {
  metadata: {
    namespace
  }
});
const deployment = new k8s.apps.v1.Deployment("nginx", {
  metadata: {
    namespace
  },
  spec: {
    selector: { matchLabels: appLabels },
    replicas: 1,
    template: {
      metadata: { labels: appLabels },
      spec: { containers: [{ name: "nginx", image: "nginx" }] }
    }
  }
});
export const name = deployment.metadata.apply(m => m.name);
