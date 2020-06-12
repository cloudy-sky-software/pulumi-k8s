import * as k8s from "@pulumi/kubernetes";

const namespace = "apps";
const appLabels = { app: "nginx" };

// Create a namespace for all "apps" resources in the cluster.
const appNs = new k8s.core.v1.Namespace("apps-ns", {
  metadata: {
    name: namespace,
  }
});

// Create a ConfigMap for the nginx container.
const configMap = new k8s.core.v1.ConfigMap("config-map", {
  metadata: {
    namespace
  },
  data: {
    someInterestingKey: "interestingValue"
  },
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
      spec: {
        containers: [{
          name: "nginx",
          image: "nginx",
          envFrom: [{
            configMapRef: { name: configMap.metadata.name }
          }]
        }]
      }
    }
  }
});
export const name = deployment.metadata.apply(m => m.name);
