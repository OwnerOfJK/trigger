import { usePushChat } from "@/components/utils/ChatProvider";
import { withLayout } from "@/layout";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface WalletAddress {
  id: number;
  address: string;
}

function CreateGroup() {
  const { pushUser, isLoading } = usePushChat();

  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [walletAddresses, setWalletAddresses] = useState<WalletAddress[]>([
    { id: 1, address: "" },
  ]);

  const addWalletInput = () => {
    const newId = walletAddresses.length + 1;
    setWalletAddresses([...walletAddresses, { id: newId, address: "" }]);
  };

  const removeWalletInput = (id: number) => {
    if (walletAddresses.length > 1) {
      setWalletAddresses(walletAddresses.filter((wallet) => wallet.id !== id));
    }
  };

  const updateWalletAddress = (id: number, address: string) => {
    setWalletAddresses(
      walletAddresses.map((wallet) =>
        wallet.id === id ? { ...wallet, address } : wallet
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // API call to create group with wallet addresses

      const res = await pushUser?.chat.group.create(groupName, {
        members: walletAddresses.map((w) => w.address),
        admins: [],
        image: "https://api.dicebear.com/7.x/bottts/svg?seed=" + groupName,
        private: false,
        rules: {
          entry: { conditions: [] },
          chat: { conditions: [] },
        },
      });

      console.log({ pushUser, res });
      navigate("/chat");
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Create New Group</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Group Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter group name"
              required
            />
          </div>

          {/* Wallet Addresses Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Member Wallet Addresses
            </label>
            <div className="space-y-3">
              {walletAddresses.map((wallet) => (
                <div key={wallet.id} className="flex gap-2">
                  <input
                    type="text"
                    value={wallet.address}
                    onChange={(e) =>
                      updateWalletAddress(wallet.id, e.target.value)
                    }
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter wallet address"
                  />
                  <button
                    type="button"
                    onClick={() => removeWalletInput(wallet.id)}
                    className="px-3 py-2 text-red-600 hover:text-red-700"
                    disabled={walletAddresses.length === 1}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addWalletInput}
                className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Another Address
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/chat")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              disabled={!groupName || !walletAddresses.some((w) => w.address)}
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withLayout(CreateGroup);
