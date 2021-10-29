# Set up an instance of the Legislation Explorer

By following this guide, you will be able to serve the latest version of the Legislation Explorer on any server, simply over SSH, thanks to the configuration management system [Ansible](https://www.ansible.com/).

> If you want to install on a local virtual machine, follow the [dedicated guide](./Serve-local-instance.md).

> For information, this guide was written with Ansible version 2.11.2 running on Python 3.9.4.

## 1. Provision a target machine

Rent a server from any commercial provider, choosing a machine that:

- Has Ubuntu 20 (Focal Fossa) as operating system. Other operating systems might be supported but are not guaranteed.
- Allows logging in as superuser (administrator) over SSH.
- Can download packages over the internet.

> In Ansible parlance, Ansible must be installed on a “[control node](https://docs.ansible.com/ansible/latest/network/getting_started/basic_concepts.html#control-node)” that will install Legislation Explorer on a “[managed node](https://docs.ansible.com/ansible/latest/network/getting_started/basic_concepts.html#managed-nodes)”. For simplicity, throughout this guide, we will focus on the most common use cases and call the control node “local machine” and the managed node “target machine”.

## 2. Install Ansible

To install Ansible, follow [the documentation](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#installing-ansible-on-specific-operating-systems) for your operating system.

To check that Ansible is properly installed, run `ansible --version`. You should get something like:

```
ansible [core 2.11.2]
   …
```

## 3. Define access to the target machine

Ansible defines configuration of target machines in files constituting an _inventory_. In order to install the Legislation Explorer on the correct target machine, you will need to write such an inventory.

Inventories are stored as YAML files in the [`inventories`](../ansible/inventories/) directory.

```yaml
# in ansible/inventories/YOUR_INVENTORY.yml
all:
  hosts:
    target.ip.or.domain.com: # define here the target machine’s IP or domain name
      ansible_user: root # define here the username to use when connecting over SSH
      # adjust the variables defined in `ansible/roles/*/defaults/main.yml` below:
      api_url: https://my-openfisca-api.example/
      host_name: my-legislation-explorer.example
```

## 4. Install and start the Legislation Explorer

1. Clone (or download) the `legislation-explorer` repository: `https://github.com/openfisca/legislation-explorer.git`.
2. Navigate to the freshly downloaded folder: `cd legislation-explorer`.
3. Type the following command: `ansible-playbook --inventory ansible/inventories/YOUR_INVENTORY.yml ansible/site.yml`.

Once the command is done, your target machine should run the Legislation Explorer. Just open `http://HOST_NAME/` in your browser. You can change the port and path through the configuration file, by changing the variables `app_port` or `base_path`.

### Optional: enable Matomo

To track the Legislation Explorer usage with Matomo, define the Ansible variables `matomo_site_id` and `matomo_url` in `YOUR_INVENTORY.yml`.

## Updates

Whenever you make adjustments to the configuration or want to update to the latest version, simply run again the commands given in the “Install and start the Legislation Explorer” section. Ansible runs are idempotent, meaning that they can be run repeatedly and will yield the same result: anytime you run the “playbook”, you should end up with a working version of the latest Legislation Explorer on the target machine defined in your inventory.
